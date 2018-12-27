import moment from 'moment';

export const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const getDateTimeString = (format) => {
    format = format ? format : DEFAULT_DATETIME_FORMAT;
    return  moment(new Date().getTime()).format(format);
}