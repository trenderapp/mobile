import dayjs from 'dayjs';
import isToday from "dayjs/plugin/isToday"
import LocalizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(isToday)
dayjs.extend(LocalizedFormat)

export class formatDate {
    constructor(date) {
        this.current_date = date;
    }

    time() {
        return dayjs(this.current_date).format("LT");
    }

    date() {
        return dayjs(this.current_date).format("L");
    }

    fullDate() {
        return dayjs(this.current_date).format("LLL");
    }

    fromNow() {
        const current = dayjs(this.current_date);
        return current.isToday() ? current.format("LT") : current.format("LLL");
    }

    isOlder(recent) {
        const current = dayjs(this.current_date);
        return current.isSameOrBefore(recent);
    }
}