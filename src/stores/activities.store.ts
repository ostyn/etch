import { action, makeObservable, observable, runInAction } from 'mobx';
import { activityDao } from '../dao/ActivityDao';
import { Activity } from '../interfaces/activity.interface';

const activitiesData: Activity[] = await activityDao.getItems();
const activitiesMap: any = {};
activitiesData.forEach((activity) => {
    activitiesMap[activity.id] = activity;
});
class ActivityStore {
    @observable
    public all: Activity[] = activitiesData;
    @observable
    map: any = activitiesMap;
    @action.bound
    public async reset() {
        this.all = [];
        this.map = {};
        activityDao.reset();
    }
    @action.bound
    public async updateActivity(updatedActivity: Activity) {
        await activityDao.saveItem(updatedActivity);
        const updatedActivities = await activityDao.getItems();
        runInAction(() => {
            this.all = updatedActivities;
            this.map = {};
            this.all.forEach((activity) => {
                this.map[activity.id] = activity;
            });
        });
    }
    @action.bound
    public async bulkImport(activities: Activity[]) {
        await activityDao.saveItems(activities);
        const updatedActivities = await activityDao.getItems();
        runInAction(() => {
            this.all = updatedActivities;
            this.map = {};
            this.all.forEach((activity) => {
                this.map[activity.id] = activity;
            });
        });
    }
    @action.bound
    public async removeActivity(id: string) {
        await activityDao.deleteItem(id);
        const updatedActivities = await activityDao.getItems();
        runInAction(() => {
            this.all = updatedActivities;
            this.map = {};
            this.all.forEach((activity) => {
                this.map[activity.id] = activity;
            });
        });
    }
    public getActivity(id: string): Activity | undefined {
        return this.map[id];
    }
    public getCategories() {
        return [...new Set(this.all.map((a) => a.category || ''))].sort();
    }
    constructor() {
        makeObservable(this);
    }
}
export const activities = new ActivityStore();
