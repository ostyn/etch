import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { base } from '../baseStyles';
import { Activity } from '../interfaces/activity.interface';
import { ActivityDetail } from '../interfaces/entry.interface';
import './activity-detail.component';

@customElement('activity-component')
export class ActivityComponent extends LitElement {
    @property()
    public detail?: ActivityDetail;
    @property()
    public showName: boolean = false;
    @property()
    public activity?: Activity;
    render() {
        if (!this.activity) return nothing;
        return html`
            <span>
                <span title.bind="activity.name" class="emoji">
                    ${this.activity.emoji}
                    <span
                        class="activity-detail-number"
                        if.bind="(isNumeric(detail) && detail != 1) || (isArray(detail) && detail.length > 1)"
                        >${Array.isArray(this.detail)
                            ? this.detail.length
                            : this.detail}</span
                    >
                    <slot></slot>
                </span>
                ${this.showName
                    ? html`<div class="activity-name">
                          ${this.activity.name}
                      </div>`
                    : nothing}
            </span>
            ${Array.isArray(this.detail) && this.detail.length > 0
                ? html` <span
                      class="activity-detail-list ${!this.isWide()
                          ? 'activity-narrow'
                          : ''}"
                      if.bind="isArray(detail) && detail.length>0"
                  >
                      ${(this.detail as string[]).map(
                          (textItem) =>
                              html`<activity-detail-component
                                  click.trigger="detailClicked($event, textItem, id)"
                                  >${textItem}</activity-detail-component
                              >`
                      )}
                  </span>`
                : nothing}
        `;
    }
    isWide(): boolean {
        return (
            Array.isArray(this.detail) &&
            (this.detail.length > 3 ||
                this.detail.filter((val) => val.length >= 50).length > 0)
        );
    }
    static styles = [
        base,
        css`
            :host {
                max-width: 100%;
                display: inline-flex;
                text-align: center;
                align-items: flex-start;
                user-select: none;
                border: 1px solid transparent;
                align-self: start;
                margin: 2px;
                padding: 4px 6px;
            }
            .emoji {
                display: inline-block;
                position: relative;
                font-size: 1.875rem;
                line-height: 2.25rem;
            }
            .activity-detail-number {
                display: inline-flex;
                position: absolute;
                left: -0.1rem;
                bottom: -0.375rem;
                padding-top: 0;
                padding-bottom: 0;
                padding-left: 0.375rem;
                padding-right: 0.375rem;
                color: var(--background-color);
                background-color: var(--color);
                font-size: 0.75rem;
                line-height: 1rem;
                justify-content: center;
                align-items: center;
                border-radius: 9999px;
            }
            .activity-detail-list {
                display: flex;
                gap: 2px;
                text-align: left;
                flex-wrap: wrap;
                justify-content: start;
                align-self: center;
                user-select: text;
            }
            .activity-narrow {
                flex-flow: column;
            }
            .activity-name {
                font-size: 0.875rem;
                line-height: 1.25rem;
                overflow-wrap: break-word;
            }
        `,
    ];
}