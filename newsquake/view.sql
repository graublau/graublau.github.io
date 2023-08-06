drop view public."relativeCountDay";

create view public."relativeCountDay"(timeframe, epic, count, relativecount) as
SELECT to_char(date_trunc('day'::text, drops.pub_date_time::date::timestamp with time zone), 'YYYY-MM-DD'::text) AS timeframe,
       drops.epic::varchar as epics,
       count(*)                                                                                                  AS count,
       count(*)::numeric / sum(count(*)) OVER () * 100::numeric                                                  AS relativecount
FROM drops
GROUP BY timeframe, epics
ORDER BY timeframe DESC, epics;
