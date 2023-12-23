import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { Router } from '@vaadin/router';
import { base } from '../baseStyles';
import { JotRoute, routerContext } from '../routes/route-config';

@customElement('nav-bar')
export class NavBar extends LitElement {
    @consume({ context: routerContext })
    @property({ attribute: false })
    public router?: Router;
    protected firstUpdated(): void {
        window.addEventListener('vaadin-router-location-changed', () => {
            this.currentPath = this.router?.location.pathname;
        });
    }
    @state()
    private currentPath = this.router?.location.pathname;
    isRouteSelected(path: string) {
        if (this.currentPath)
            return (
                this.currentPath === path ||
                (this.currentPath === '/' && path === '/entries')
            );
    }

    render() {
        return html`
            <footer>
                <span class="footer-content">
                    ${(this.router?.getRoutes() || [])
                        .filter((route: JotRoute) => route.options?.menuItem)
                        .map((route: JotRoute) => {
                            return html`<a
                                class="item-wrapper"
                                href="${route.path}"
                                ><span
                                    class=${'menu-bar-item ' +
                                    (this.isRouteSelected(route.path)
                                        ? 'menu-bar-item-active'
                                        : 'menu-bar-item-inactive')}
                                >
                                    <jot-icon
                                        name=${route.options?.iconName ||
                                        'Smile'}
                                        size="large"
                                    >
                                    </jot-icon>
                                    <span class="menu-bar-item-text">
                                        ${this.isRouteSelected(route.path)
                                            ? route.name
                                            : nothing}</span
                                    >
                                </span></a
                            >`;
                        })}
                </span>
            </footer>
        `;
    }
    static styles = [
        base,
        css`
            footer {
                width: 100%;
                position: fixed;
                bottom: -1px;
                background-color: var(--card-background-color);
                box-shadow: var(--card-box-shadow);
                z-index: 100;
                //This is for the iOS navbar
                padding-bottom: 16px;
            }
            .footer-content {
                display: flex;
                justify-content: center;
                align-items: center;
                user-select: none;
                gap: 0.5rem;
            }
            .item-wrapper {
                height: 64px;
                width: 96px;
                display: flex;
                align-items: center;
            }

            .menu-bar-item {
                transition: height 0.2s;
                cursor: pointer;
                width: 5rem;
                height: 3rem;
                display: inline-flex;
                flex-flow: column;
                align-items: center;
                font-size: 12px;
                font-weight: bold;
            }
            .menu-bar-item-inactive {
                height: 1.5rem;
                opacity: 0.6;
            }
            svg {
                --color: var(--contrast);
                height: 1.5rem;
                width: 1.5rem;
            }
            .menu-bar-item-active jot-icon {
                line-height: 0px;
                transition: all 0.2s;
                background: var(--secondary);
                color: var(--primary-inverse);
                border-radius: 20px;
                padding: 4px 20px;
            }
            a:focus,
            a:active {
                background-color: transparent;
            }
        `,
    ];
}
