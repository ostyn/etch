import { css, html, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { MobxLitElement } from '@adobe/lit-mobx';
import { base } from '../../baseStyles';
import { Activity } from '../../interfaces/activity.interface';
import { activities } from '../../stores/activities.store';
import { dispatchEvent, Events } from '../../utils/Helpers';

@customElement('activity-edit-sheet')
export class ActivityEditSheet extends MobxLitElement {
    inputRef: Ref<HTMLElement> = createRef();
    @property({ attribute: false })
    activity!: Activity;
    @state()
    localActivity: Activity = {
        isArchived: false,
        name: '',
        category: '',
        emoji: '',
    } as Activity;
    firstUpdated() {
        this.localActivity = { ...this.localActivity, ...this.activity };
    }
    @property({ attribute: false })
    isCustom = false;

    deleteActivity() {
        if (confirm('Sure you want to delete?')) {
            activities.removeActivity(this.localActivity.id);
            dispatchEvent(this, Events.activityDeleted);
        }
    }
    submitActivity() {
        activities.updateActivity(this.localActivity);
        dispatchEvent(this, Events.activitySubmitted);
    }
    selectCategory(value: string) {
        this.changeCategory(value);
        this.isCustom = false;
    }
    changeCategory(category: string) {
        this.localActivity = { ...this.localActivity, category };
    }
    selectCustom() {
        this.isCustom = true;
        this.inputRef?.value?.focus();
    }
    static getActionSheet(
        data: any,
        submit: (data: any) => void
    ): TemplateResult {
        return html`<activity-edit-sheet
            @activityDeleted=${submit}
            @activitySubmitted=${submit}
            .activity=${data}
        ></activity-edit-sheet>`;
    }
    render() {
        return html`<form>
            <section class="activity-inputs">
                <input
                    class="inline"
                    type="text"
                    .value=${this.localActivity?.name || ''}
                    @change=${(e: any) => {
                        this.localActivity = {
                            ...this.localActivity,
                            name: e.target.value,
                        };
                    }}
                    placeholder="name"
                />
                <input
                    class="inline"
                    type="text"
                    .value=${this.localActivity?.emoji || ''}
                    @change=${(e: any) => {
                        this.localActivity = {
                            ...this.localActivity,
                            emoji: e.target.value,
                        };
                    }}
                    placeholder="emoji"
                />
            </section>
            <section class="lastRow">
                <details class="inline category-control" role="list">
                    <summary aria-haspopup="listbox">
                        ${this.localActivity?.category || 'category'}
                    </summary>
                    <ul role="listbox" class="option-list">
                        ${activities.getCategories().map(
                            (category) => html`
                                <li
                                    @click=${(e: any) =>
                                        this.selectCategory(e.target.value)}
                                    .class=${this.localActivity?.category ===
                                    category
                                        ? 'selected-category'
                                        : ''}
                                >
                                    <label>
                                        <input
                                            type="radio"
                                            name="category"
                                            .value=${category}
                                            .checked=${category ===
                                            this.localActivity?.category}
                                            class="radio-button"
                                        />
                                        ${category}
                                    </label>
                                </li>
                            `
                        )}

                        <li @click=${this.selectCustom}>
                            <label>
                                <input
                                    class="radio-button"
                                    type="radio"
                                    name="category"
                                />
                                ${this.isCustom
                                    ? html`<input
                                          ${ref(this.inputRef)}
                                          class="custom-category"
                                          type="text"
                                          @change=${(e: any) =>
                                              this.changeCategory(
                                                  e.target.value
                                              )}
                                          .value=${this.localActivity
                                              .category || ''}
                                          placeholder="category"
                                          focus="true"
                                      />`
                                    : html`<span>new category</span>`}
                            </label>
                        </li>
                    </ul>
                </details>
                <label class="inline archiveSwitch"
                    ><input
                        type="checkbox"
                        role="switch"
                        .checked=${this.localActivity?.isArchived}
                        @change=${() => {
                            this.localActivity = {
                                ...this.localActivity,
                                isArchived: !this.localActivity.isArchived,
                            };
                        }}
                    />Archived</label
                >
            </section>
            <section>
                <button
                    class="inline"
                    type="button"
                    @click=${this.submitActivity}
                >
                    submit
                </button>
                ${this.localActivity?.id
                    ? html`<button
                          class="inline secondary"
                          type="button"
                          @click=${this.deleteActivity}
                      >
                          delete
                      </button>`
                    : nothing}
            </section>
        </form>`;
    }
    static styles = [
        base,
        css`
            .activity-edit-buttons {
                text-align: center;
            }
            activity-edit .category-control .option-list {
                position: relative;
            }
            .category-control * {
                z-index: 50;
                width: fit-content;
            }
            input.custom-category {
                width: calc(100% - 20px);
            }
            .selected-category {
                background-color: var(--contrast);
                color: var(--contrast-inverse);
            }
            .radio-button {
                position: absolute;
                opacity: 0;
            }
            .category-control ul.option-list {
                position: unset;
            }
            .option-list * {
                cursor: pointer;
            }
            .lastRow {
                display: flex;
                gap: 16px;
            }
            .archiveSwitch {
                padding: 12px;
            }
        `,
    ];
}
