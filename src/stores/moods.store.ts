import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from 'mobx';
import { moodDao } from '../dao/MoodDao';
import { Mood } from '../interfaces/mood.interface';

const savedMoods = await moodDao.getItems();

class MoodStore {
    @observable
    public userCreated: Mood[] = savedMoods;
    public default: Mood[] = [
        {
            emoji: '🚧',
            id: '0',
            rating: '3',
            name: 'TBD',
        },
    ];
    @computed
    public get all() {
        return [...this.userCreated, ...this.default];
    }
    @action.bound
    public async updateMood(updatedMood: Mood) {
        await moodDao.saveItem(updatedMood);
        const updatedMoods = await moodDao.getItems();
        runInAction(() => {
            this.userCreated = updatedMoods;
        });
    }
    @action.bound
    public async bulkImport(moods: Mood[]) {
        await moodDao.saveItems(moods);
        const updatedMoods = await moodDao.getItems();
        runInAction(() => {
            this.userCreated = updatedMoods;
        });
    }
    @action.bound
    public async removeMood(id: string) {
        await moodDao.deleteItem(id);
        const updatedMoods = await moodDao.getItems();
        runInAction(() => {
            this.userCreated = updatedMoods;
        });
    }
    public async getMood(id: string): Promise<Mood | undefined> {
        if (id === '0') return this.default[0];
        return moodDao.getItem(id);
    }
    constructor() {
        makeObservable(this);
    }
}
export const moods = new MoodStore();
