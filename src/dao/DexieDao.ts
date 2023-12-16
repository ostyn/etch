import { EditTools } from '../interfaces/entry.interface';
import { db } from '../services/Dexie';
import { TrackerDao } from './TrackerDao';

export class DexieDao implements TrackerDao {
    name: string;
    notify: any = () => {};

    constructor(name: string) {
        this.name = name;
    }
    setupCacheAndUpdateListener(notify: any): void {
        this.notify = notify;
        notify();
    }
    reset() {
        db.table(this.name).clear();
    }
    async getItem(id: string): Promise<any> {
        return this.processData(await db.table(this.name).get(id));
    }
    async getItems(): Promise<any> {
        let rawItems = await db.table(this.name).toArray();
        return this.getItemsFromQuery(rawItems);
    }
    private processData(item: any): any {
        return this.afterLoadFixup(item);
    }
    getItemsFromQuery(rawItems: any): Promise<any> {
        let items: any[] = [];
        rawItems.forEach((item: any) => {
            items.push(this.processData(item));
        });
        return Promise.resolve(this.sortItems(items));
    }
    saveItem(passedEntry: any): Promise<any> {
        if (passedEntry.id === undefined || !passedEntry.id) {
            passedEntry.id = crypto.randomUUID();
        }
        passedEntry.updated = new Date();
        if (!passedEntry.created) {
            passedEntry.created = passedEntry.updated;
        }
        passedEntry.lastUpdatedBy = EditTools.WEB;
        if (!passedEntry.createdBy) {
            passedEntry.createdBy = EditTools.WEB;
        }
        passedEntry = this.beforeSaveFixup(passedEntry);
        const newLocal = db.table(this.name).put(passedEntry);
        newLocal.then(() => {
            this.notify();
        });
        return newLocal;
    }
    async saveItems(
        passedItems: any[],
        importTool = EditTools.DAYLIO_IMPORT
    ): Promise<any> {
        const itemsToSave: any[] = [];
        passedItems.forEach((item) => {
            let newItem = { ...item };
            if (newItem.id === undefined || !newItem.id) {
                newItem.id = crypto.randomUUID();
            }
            newItem.updated = new Date();
            if (!newItem.created) {
                newItem.created = newItem.updated;
            }
            item.lastUpdatedBy = importTool;
            if (!item.createdBy) {
                item.createdBy = importTool;
            }
            newItem = this.beforeSaveFixup(newItem);
            itemsToSave.push(newItem);
        });

        await db.table(this.name).bulkAdd(itemsToSave);
        this.notify();
    }
    async deleteItem(id: any): Promise<void> {
        await db.table(this.name).delete(id);
        this.notify();
    }
    beforeSaveFixup(item: any) {
        return item;
    }
    afterLoadFixup(item: any) {
        return item;
    }
    sortItems(items: any): any[] {
        return items;
    }
}