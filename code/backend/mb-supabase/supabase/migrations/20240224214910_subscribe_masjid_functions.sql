alter table "public"."masjid" drop constraint "masjid_uuid_key";

drop index if exists "public"."masjid_uuid_key";

alter table "public"."masjid" drop column "uuid";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.subscribe_to_masjid(masjid_id bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$#variable_conflict use_column
DECLARE
    user_id UUID;
    subscription_id INT8;
BEGIN
    -- Get the user's ID using auth.uid()
    user_id := auth.uid();
    
    -- Check if the user is already subscribed to the masjid
    IF EXISTS (
        SELECT 1
        FROM public.user_masjid_subscription ums
        WHERE ums.user_id = user_id
          AND ums.masjid_id = masjid_id
    ) THEN
        RAISE EXCEPTION 'User is already subscribed to this masjid';
    ELSE
        -- Insert a new subscription record
        INSERT INTO public.user_masjid_subscription(user_id, masjid_id)
        VALUES (user_id, masjid_id)
        RETURNING id INTO subscription_id;
        
        -- You can perform additional actions if needed
        
        -- Raise a notice or return some information about the subscription
        RAISE NOTICE 'User % subscribed to masjid % with subscription ID %', user_id, masjid_id, subscription_id;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.unsubscribe_from_masjid(masjid_id bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$

#variable_conflict use_column
DECLARE
    user_id UUID;
BEGIN
    -- Get the user's ID using auth.uid()
    user_id := auth.uid();
    
    -- Check if the user is subscribed to the masjid
    IF EXISTS (SELECT 1 FROM public.user_masjid_subscription us WHERE us.user_id = user_id AND us.masjid_id = masjid_id) THEN
        -- Delete the subscription record
        DELETE FROM public.user_masjid_subscription
        WHERE user_id = user_id AND masjid_id = masjid_id;
        
        -- You can perform additional actions if needed
        
        -- Raise a notice or return some information about the unsubscription
        RAISE NOTICE 'User % unsubscribed from masjid %', user_id, masjid_id;
    ELSE
        RAISE EXCEPTION 'User is not subscribed to this masjid';
    END IF;
END;

$function$
;


