import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AfterEnterObserver, Router } from '@vaadin/router';
import { parseISO } from 'date-fns';
import { base } from '../baseStyles';
import { ActionSheetController } from '../components/action-sheets/action-sheet-controller';
import '../components/entry.component';
import '../components/month-control.component';
import { entryDao } from '../dao/EntryDao';
import { Entry } from '../interfaces/entry.interface';

@customElement('entries-route')
export class EntriesRoute extends LitElement implements AfterEnterObserver {
    @state() currentDate: Date = new Date();
    public router?: Router;
    @state() scrollToDate?: number;
    @state() filteredEntries: Entry[] = [];
    onAfterEnter() {
        window.addEventListener(
            'vaadin-router-location-changed',
            this.getParamsAndUpdate
        );
        this.getParamsAndUpdate();
    }
    onAfterLeave() {
        window.removeEventListener(
            'vaadin-router-location-changed',
            this.getParamsAndUpdate
        );
        this.getParamsAndUpdate();
    }
    private getParamsAndUpdate = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const dayParam = urlParams.get('day');
        const monthParam = urlParams.get('month');
        const yearParam = urlParams.get('year');
        let currentDay;
        if (dayParam) {
            currentDay = Number.parseInt(dayParam);
            this.scrollToDate = currentDay;
        } else {
            currentDay = 1;
        }
        const currentMonth = monthParam
            ? Number.parseInt(monthParam) - 1
            : new Date().getMonth();
        const currentYear = yearParam
            ? Number.parseInt(yearParam)
            : new Date().getFullYear();

        this.currentDate = new Date(currentYear, currentMonth, currentDay);
        this.filteredEntries = await entryDao.getEntriesFromYearAndMonth(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1
        );
    };
    shouldScrollToSelf(entry: Entry) {
        return parseISO(entry.date).getDate() === this.scrollToDate;
    }
    onMonthClick() {
        window.scrollTo({ top: 0 });
    }
    async onMonthChange(e: CustomEvent) {
        const date: Date = e.detail;
        window.scrollTo({ top: 0 });
        const queryParams = new URLSearchParams({
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        } as any).toString();
        this.currentDate = date;
        Router.go(`entries?${queryParams}`);
    }
    render() {
        return html`<section class="month-control-bar">
                <month-control
                    .date=${this.currentDate}
                    @monthChange=${this.onMonthChange}
                    @monthClick=${this.onMonthClick}
                ></month-control>
            </section>
            <section>
                ${this.filteredEntries.map(
                    (entry: Entry) =>
                        html`<entry-component
                            .scrollToSelf=${this.shouldScrollToSelf(entry)}
                            .entry="${entry}"
                            @activityClick=${(e: any) => {
                                ActionSheetController.open({
                                    type: 'activityInfo',
                                    data: {
                                        id: e.detail.id,
                                        date: entry.dateObject,
                                    },
                                });
                            }}
                            @activityLongClick=${(e: any) => {
                                ActionSheetController.open({
                                    type: 'activityInfo',
                                    data: {
                                        id: e.detail.id,
                                        date: entry.dateObject,
                                    },
                                });
                            }}
                        ></entry-component>`
                )}
            </section>
            <div class="sticky-buttons">
                <button
                    class="inline contrast"
                    @click=${() => Router.go('search')}
                >
                    <feather-icon name="search"></feather-icon>
                </button>
                <button class="inline" @click=${() => Router.go('entry')}>
                    <feather-icon name="edit-3"></feather-icon>
                </button>
            </div>`;
    }
    static styles = [
        base,
        css`
            .month-control-bar {
                position: sticky;
                z-index: 50;
                top: -0.1px;
                background-color: var(--background-color);
                padding-top: 0.375rem;
                padding-bottom: 0.375rem;

                margin: 0.5rem;
            }
        `,
    ];
}
