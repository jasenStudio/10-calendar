import { parseISO } from "date-fns"


export const convertToDateEvents = (events = []) => {
    return events.map(event => {
        event.end = parseISO(event.end)
        event.start = parseISO(event.start)

        return event;
    })
}
