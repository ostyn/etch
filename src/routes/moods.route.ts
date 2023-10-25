import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import * as data from '../assets/data.json';
import base from '../baseStyles';
import { Mood } from '../interfaces/mood.interface';

@customElement('moods-route')
export class MoodsRoute extends LitElement {
    moods: Mood[] = data.moods as Mood[];

    render() {
        return html`<article>
            <section>
                ${this.moods.map((mood) => {
                    return html`<button>${mood.emoji}</button>`;
                })}
            </section>
            <mood-edit mood.two-way="mood"></mood-edit>
        </article>`;
    }
    static styles = [base];
}
