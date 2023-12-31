import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
    Activity,
    AlertTriangle,
    AlignJustify,
    ArrowRight,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Cloud,
    createElement,
    DownloadCloud,
    Eye,
    EyeOff,
    FileText,
    Import,
    Info,
    Maximize2,
    Menu,
    Minimize2,
    PenLine,
    Play,
    Plus,
    PlusCircle,
    Save,
    Search,
    Server,
    Settings,
    Share,
    Smile,
    SmilePlus,
    Trash2,
    TrendingUp,
    UploadCloud,
    XCircle,
} from 'lucide';

// Find Unused icons: [\\'\\"]AlertTriangle
const mapping = {
    AlertTriangle,
    AlignJustify,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    FileText,
    Maximize2,
    Minimize2,
    PenLine,
    Play,
    Plus,
    PlusCircle,
    Save,
    Search,
    Server,
    Smile,
    Trash2,
    TrendingUp,
    XCircle,
    BookOpen,
    Activity,
    Settings,
    UploadCloud,
    DownloadCloud,
    Info,
    Cloud,
    Share,
    Import,
    SmilePlus,
};
export type JotIconName = keyof typeof mapping;

@customElement('jot-icon')
export class JotIcon extends LitElement {
    @property({ type: String })
    name: JotIconName = 'Smile';
    @property({ type: Object })
    size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
    render() {
        const icon = createElement(mapping[this.name] || Menu);
        icon.classList.add(this.size);
        return icon;
    }
    static styles = [
        css`
            .small {
            }
            .medium {
            }
            .large {
                height: 1.5rem;
                width: 1.5rem;
            }
            .xlarge {
            }
        `,
    ];
}
