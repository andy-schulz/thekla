import {ActivityLogEntry, ActivityLogEntryType, ActivityLogNode, ActivityStatus} from "./ActivityLogEntry";
import {encodeLog, formatLogAsHtmlTree, formatLogWithPrefix}                     from "./format_log";
import _                                                                         from "lodash";

export class ActivityLog {
    private readonly rootActivityLogEntry: ActivityLogEntry;
    private _currentActivity: ActivityLogEntry;

    public addActivityLogEntry(
        activityName: string,
        activityDescription: string,
        activityType: ActivityLogEntryType,
        activityStatus: ActivityStatus): ActivityLogEntry {
        const logEntry = new ActivityLogEntry(
            activityName,
            activityDescription,
            activityType,
            activityStatus,
            this._currentActivity);
        // this._currentActivity.addActivityLogEntry(logEntry);
        // if parent entry is passed in constructor, the new entry is already added to the parent entry
        this._currentActivity = logEntry;

        return logEntry;

    }

    public reset(entry: ActivityLogEntry): void {
        if (entry.parent)
            this._currentActivity = entry.parent;
    }

    public getLogTree(): ActivityLogNode {
        this.setRootNodeStatus();
        return this.rootActivityLogEntry.getLogTree();
    }

    /**
     * if all activities have status passed the root node status is passed,
     * if one is failed the root node will be marked as failed
     */
    private setRootNodeStatus() {
        const list = this.rootActivityLogEntry.getSubTreeStatusList();
        this.rootActivityLogEntry.status = list.includes(`failed`) ? `failed` : list.includes(`running`) ? `running` : `passed`
    }

    public getStructuredLog(logPrefix: string = `    `, encoding: string = ``): string {
        this.setRootNodeStatus();
        const logTree = this.rootActivityLogEntry.getLogTree();
        return _.flow(
            formatLogWithPrefix(`${logPrefix}`)(0),
            encodeLog(encoding)
        )(logTree)
    };

    public getStructuredHtmlLog(encoding = ``): string {
        this.setRootNodeStatus();
        const logTree = this.rootActivityLogEntry.getLogTree();
        return _.flow(
            formatLogAsHtmlTree,
            encodeLog(encoding)
        )(logTree)
    };

    public constructor(name: string) {
        this._currentActivity = new ActivityLogEntry(
            `START`,
            `${name} attempts to`,
            `Task`,
            `running`,
            null);

        this.rootActivityLogEntry = this._currentActivity
    }
}