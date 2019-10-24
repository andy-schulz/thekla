/* eslint-disable quotes */
export type ActivityLogEntryType = "Task" | "Interaction";
export type ActivityStatus = "running" | "failed" | "passed";

export interface ActivityLogNode {
    name: string;
    description: string;
    logType: ActivityLogEntryType;
    status: ActivityStatus;
    activityNodes: ActivityLogNode[];
}

export class ActivityLogEntry {
    private subEntries: ActivityLogEntry[] = [];

    public constructor(
        private activityName: string,
        private activityDescription: string,
        private activityType: ActivityLogEntryType,
        private activityStatus: ActivityStatus,
        public parent: ActivityLogEntry | null
    ) {

    }

    /**
     * set the node status information
     * @param status the node status
     */
    public set status(status: ActivityStatus) {
        this.activityStatus = status;
    }

    /**
     * get the node status information
     */
    public get status(): ActivityStatus {
        return this.activityStatus;
    }

    /**
     * add an activity entry to the log, the entry will be added to the end of the list
     * @param entry the entry to be added to the log
     */
    public addActivityLogEntry(entry: ActivityLogEntry): void {
        this.subEntries.push(entry);
    }

    /**
     * get a list(array) of all node status
     */
    public getSubTreeStatusList(): ActivityStatus[] {
        return this.subEntries.map((node: ActivityLogEntry): ActivityStatus => {
            return node.status
        })
    }

    /**
     * get the the JSON tree of the current node
     */
    public getLogTree(): ActivityLogNode {
        return {
            name: this.activityName,
            description: this.activityDescription,
            logType: this.activityType,
            status: this.activityStatus,
            activityNodes: this.subEntries.map((logEntry: ActivityLogEntry): ActivityLogNode => {
                return logEntry.getLogTree();
            })
        }
    }
}