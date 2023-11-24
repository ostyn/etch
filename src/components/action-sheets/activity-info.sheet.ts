import { css, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getDaysInMonth } from 'date-fns';
import { base } from '../../baseStyles';
import { ActivityDetail, Entry } from '../../interfaces/entry.interface';
import { StatsDetailEntry } from '../../interfaces/stats.interface';
import { activities } from '../../stores/activities.store';
import { entries } from '../../stores/entries.store';

@customElement('activity-info-sheet')
export class ActivityInfoSheet extends LitElement {
    @property()
    activityId!: string;
    @property()
    onChange!: (a: any) => {};
    daysWithActivity: number = 0;
    percentOfDays: string = '';
    totalActivity: number = 0;
    @state()
    selectedTextItem?: string;
    relatedEntryMap?: Map<string, Entry>;
    daysElapsed?: number;
    month?: number;
    year?: number;
    @state()
    dateValues: any = {};
    mfuDetails?: StatsDetailEntry[];
    mruDetails?: StatsDetailEntry[];
    showLists: boolean = true;
    @state()
    filter: string = '';

    static getActionSheet(
        data: any,
        _submit: (data: any) => void,
        _dismiss: () => void
    ): TemplateResult {
        return html`<header>Activity Info</header>
            <activity-info-sheet activityId=${data.id}></activity-info-sheet>`;
    }
    protected firstUpdated(): void {
        let date = new Date();
        this.loadMru();
        this.onMonthChange(date.getMonth(), date.getFullYear());
    }
    public onMonthChange = (month: number, year: number) => {
        this.dateValues = {};
        this.month = month;
        this.year = year;
        let activityStats = entries.stats.get(this.activityId);
        let affectedDates = activityStats?.dates;

        if (activityStats && activityStats.detailsUsed && this.selectedTextItem)
            affectedDates = activityStats.detailsUsed.get(this.selectedTextItem)
                ?.dates;
        const entryDates = affectedDates?.filter(
            (date) =>
                date.entry.dateObject.getMonth() === month &&
                date.entry.dateObject.getFullYear() === year
        );
        this.relatedEntryMap = new Map();
        this.totalActivity = 0;
        for (let entryDate of entryDates || []) {
            this.relatedEntryMap.set(entryDate.date, entryDate.entry);
            const activityDetail: ActivityDetail =
                entryDate.entry.activities[this.activityId];
            this.totalActivity += Array.isArray(activityDetail)
                ? activityDetail.length
                : activityDetail;
            this.dateValues[entryDate.date] = Array.isArray(activityDetail)
                ? activityDetail.length
                : activityDetail;
        }

        this.daysElapsed = this.getDaysElapsedInMonth(month, year);
        this.daysWithActivity = this.relatedEntryMap.size;
        this.percentOfDays = this.daysElapsed
            ? ((this.daysWithActivity / this.daysElapsed) * 100).toFixed(2)
            : '0.00';
        console.log(
            this.daysWithActivity,
            this.daysElapsed,
            this.percentOfDays
        );
    };
    private getDaysElapsedInMonth(month: number, year: number): number {
        const currentDate = new Date();
        if (new Date(year, month, 1).getTime() > currentDate.getTime())
            return 0;
        if (
            month === currentDate.getMonth() &&
            year == currentDate.getFullYear()
        )
            return currentDate.getDate();
        else return getDaysInMonth(new Date(year, month, 1));
    }
    loadMru() {
        if (!entries.stats.get(this.activityId)?.detailsUsed) {
            this.showLists = false;
            return;
        }
        const map: Map<string, StatsDetailEntry> =
            entries.stats.get(this.activityId)?.detailsUsed || new Map();
        this.mfuDetails = Array.from(map.values()).filter(
            (frequentlyUsedDetail) =>
                frequentlyUsedDetail.text
                    .toLowerCase()
                    .includes(this.filter.toLowerCase())
        );
        this.mfuDetails = this.mfuDetails.sort((a, b) => {
            return b.count - a.count;
        });
        this.mfuDetails = this.mfuDetails.slice(
            0,
            Math.min(7, this.mfuDetails.length)
        );

        this.mruDetails = Array.from(map.values()).filter(
            (recentlyUsedDetail: StatsDetailEntry) =>
                recentlyUsedDetail.text
                    .toLowerCase()
                    .includes(this.filter.toLowerCase())
        );
        this.mruDetails = this.mruDetails.sort(
            (a: StatsDetailEntry, b: StatsDetailEntry) => {
                return (
                    b.dates[0].date.localeCompare(a.dates[0].date) ||
                    b.count - a.count
                );
            }
        );
        this.mruDetails = this.mruDetails.slice(
            0,
            Math.min(7, this.mruDetails.length)
        );
    }
    render() {
        return html`
            <header class="activity-info-header">
                <activity-component
                    .activity=${activities.getActivity(this.activityId)}
                ></activity-component
                ><span>
                    <div>This month: ${this.daysWithActivity}</div>
                    <div>Percent of days: ${this.percentOfDays}%</div>
                    <div>Total Count: ${this.totalActivity}</div>
                    <div>
                        Average per day:
                        ${(this.totalActivity / this.daysWithActivity).toFixed(
                            2
                        )}
                    </div>
                </span>
                <close-button click.trigger="controller.ok()"></close-button>
            </header>
            <calendar-wrapper
                if.bind="!loading"
                class="inline"
                .dateValues=${this.dateValues}
                @viewChange=${(e: any) =>
                    this.onMonthChange(e.detail.month, e.detail.year)}
                on-date-select.call="onDateSelect(date)"
            ></calendar-wrapper>

            <ul>
                ${Array.from(this.relatedEntryMap?.entries() || []).map(
                    ([key, value]) =>
                        html`<li
                            class="activity-info-recent"
                            click.trigger="onDateSelect(key)"
                        >
                            <span class="activity-info-recent-date"
                                >${key}</span
                            >
                            ${Array.isArray(value.activities[this.activityId])
                                ? (
                                      value.activities[
                                          this.activityId
                                      ] as string[]
                                  ).map(
                                      (textItem) =>
                                          html`<activity-detail-component
                                              click.trigger="selectTextItem(textItem)"
                                              >${textItem}</activity-detail-component
                                          >`
                                  )
                                : html`<activity-detail-component
                                      >${activities.getActivity(
                                          this.activityId
                                      )}</activity-detail-component
                                  >`}
                        </li>`
                )}
            </ul>
            <input
                if.bind="showLists"
                ref="inputBox"
                type="search"
                value.bind="filter"
                placeholder="search..."
            />
            ${this.showLists
                ? html`<div class="stats-block">
                      <div class="stats-column">
                          ${this.mfuDetails?.map(
                              (detail) =>
                                  html`<div
                                      click.trigger="onDateSelect(detail.dates[0].date)"
                                      class="stats-entry"
                                  >
                                      <span class="stats-entry-datapoint"
                                          >${detail.count}</span
                                      ><activity-detail-component
                                          >${detail.text}</activity-detail-component
                                      >
                                  </div>`
                          )}
                      </div>
                      <div class="stats-column">
                          ${this.mruDetails?.map(
                              (detail) =>
                                  html` <div
                                      click.trigger="onDateSelect(detail.dates[0].entry.date)"
                                      class="stats-entry"
                                  >
                                      <span class="stats-entry-datapoint"
                                          >${detail.dates[0].date}</span
                                      ><activity-detail-component
                                          >${detail.text}</activity-detail-component
                                      >
                                  </div>`
                          )}
                      </div>
                  </div>`
                : nothing}
        `;
    }
    static styles = [
        base,
        css`
            .activity-info-header {
                display: flex;
            }
            .activity-info-recent {
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                cursor: pointer;
                list-style: none;
            }
            .activity-info-recent-date {
                display: inline-flex;
                padding-top: 0;
                padding-bottom: 0;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
                margin-right: 0.5rem;
                color: var(--background-color);
                background-color: var(--color);
                font-size: 0.75rem;
                line-height: 1rem;
                justify-content: center;
                align-items: center;
                border-radius: 9999px;
                border-color: #000000;
            }
            .stats-block {
                display: flex;
            }
            .stats-column {
                display: inline-block;
                width: 50%;
                user-select: none;
            }
            .stats-entry {
                padding: 0.75rem;
                cursor: pointer;
            }
            .stats-entry-datapoint {
                display: inline-flex;
                padding-top: 0;
                padding-bottom: 0;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
                margin-right: 0.5rem;
                color: var(--background-color);
                background-color: var(--color);
                font-size: 0.75rem;
                line-height: 1rem;
                justify-content: center;
                align-items: center;
                border-radius: 9999px;
                border-color: #000000;
            }
        `,
    ];
}
