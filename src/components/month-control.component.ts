import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { addMonths, format } from 'date-fns';
import { base } from '../baseStyles';

@customElement('month-control')
export class MonthControlComponent extends LitElement {
    @property() onMonthChange?: (a: Date) => void;
    @property() onMonthClick = () => {};
    @property({ attribute: false }) date: Date = new Date();
    public monthName?: string;
    showStreakMessage: boolean = false;
    stats?: {
        currentStreak: number;
        longestStreak: number;
        streaks: number[];
        todayInStreak: boolean;
        withinCurrentStreak: boolean;
    };
    private syncDisplayWithDate() {
        this.monthName = format(this.date, 'LLLL');
        this.showStreakMessage =
            this.date.getMonth() == new Date().getMonth() &&
            this.date.getFullYear() == new Date().getFullYear();
    }
    prev() {
        this.date = addMonths(this.date, -1);
        this.fireMonthChangeCallback(this.date);
    }
    next() {
        this.date = addMonths(this.date, 1);
        this.fireMonthChangeCallback(this.date);
    }
    triggerMonthClick() {
        if (this.onMonthClick) this.onMonthClick();
    }
    getStats = () => {
        this.stats = undefined; //this.statsService.getStreakSummary(); TODO Fix Stats
    };
    private fireMonthChangeCallback(newDate: Date) {
        if (this.onMonthChange) this.onMonthChange(newDate);
    }
    render() {
        this.syncDisplayWithDate();
        this.getStats();
        return html`<feather-icon
                class="next-prev-button"
                @click=${this.prev}
                name="chevron-left"
            ></feather-icon>
            <span class="month-header-container">
                <div class="month-header">
                    <span
                        @click=${this.triggerMonthClick}
                        class="month-header-date"
                        >${this.monthName} ${this.date.getFullYear()}</span
                    >
                    ${this.showStreakMessage && this.stats?.todayInStreak
                        ? html`<span class="streak-stats">
                              <feather-icon name="trending-up"></feather-icon>
                              ${this.stats?.currentStreak}
                          </span>`
                        : nothing}
                </div>
            </span>

            <feather-icon
                class="next-prev-button"
                @click=${this.next}
                name="chevron-right"
            ></feather-icon>`;
    }
    static styles = [
        base,
        css`
            :host {
                display: flex;
                user-select: none;
            }
            .next-prev-button {
                cursor: pointer;
            }
            .month-header-container {
                text-align: center;
                flex: 1 1 auto;
                align-self: center;
            }
            .month-header {
                display: inline-block;
                position: relative;
            }
            .month-header-date {
                cursor: pointer;
            }
            .streak-stats {
                position: absolute;
                margin-left: 12px;
                font-size: 0.875rem;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-weight: 700;
                filter: grayscale(1);
            }
            .streak-stats feather-icon {
                height: auto;
            }
        `,
    ];
}
