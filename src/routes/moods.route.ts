import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { base } from '../baseStyles';
import { ActionSheetController } from '../components/action-sheets/action-sheet-controller';
import { Mood } from '../interfaces/mood.interface';
import { moods } from '../stores/moods.store';

@customElement('moods-route')
export class MoodsRoute extends LitElement {
    @state()
    moods: Mood[] = moods.getState().userCreated;
    constructor() {
        super();
        moods.subscribe((state) => {
            this.moods = state.userCreated;
        });
    }
    moodSelected(mood?: Mood) {
        ActionSheetController.open({
            type: 'moodEdit',
            data: mood || {},
        });
    }
    render() {
        return html` <article>
            <header>Moods</header>
            <section>
                ${this.moods.map((mood) => {
                    return html`<span
                        @click=${() => this.moodSelected(mood)}
                        class="moods-mood"
                        >${mood.emoji}</span
                    >`;
                })}
                <span class="moods-mood" @click=${() => this.moodSelected()}>
                    <feather-icon name="plus-circle"></feather-icon>
                </span>
            </section>
        </article>`;
    }
    static styles = [
        base,
        css`
            .moods-mood {
                font-size: 2rem;
                cursor: pointer;
            }
        `,
    ];
}
