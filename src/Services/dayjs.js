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

    postDate(i18n = "en") {
        const days = dayjs(dayjs()).diff(this.current_date, "day");
        if(days < 7) return dayjs(this.current_date).locale(i18n).fromNow(true).replace("une", "1").replace("un", "1")
        else return dayjs(this.current_date).format("LLL");
    }

    fromNow(i18n = "en") {
        const current = dayjs(this.current_date);
        return current.isToday() ? current.locale(i18n).format("LT") : current.locale(i18n).format("LLL");
    }

    isOlder(recent) {
        const current = dayjs(this.current_date);
        return current.isSameOrBefore(recent);
    }
}