SET session_replication_role = replica;
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.5 (Ubuntu 15.5-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


--
-- Data for Name: masjid; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."masjid" ("id", "created_at", "address", "mobile_no", "name", "longitude", "latitude") VALUES
	(17, '2023-12-16 09:42:10.074932+00', '{"line1": "123 Main St", "line2": "Apt 4", "pin": "12345"}', '123-456-7890', 'Masjid A', 40.7128, -74.0060),
	(18, '2023-12-16 09:42:10.074932+00', '{"line1": "456 Oak St", "line2": "Suite 7", "pin": "56789"}', '987-654-3210', 'Masjid B', 34.0522, -118.2437),
	(20, '2023-12-16 09:42:10.074932+00', '{"line1": "987 Pine St", "line2": "Apt 23", "pin": "78901"}', '999-888-7777', 'Masjid D', -33.8688, 18.468197877031162),
	(19, '2023-12-16 09:42:10.074932+00', '{"line1": "789 Elm St", "line2": "Unit 12", "pin": "67890"}', '555-123-4567', 'Masjid C', 73.88576687440813, -0.1278),
	(21, '2023-12-16 09:42:10.074932+00', '{"line1": "654 Birch St", "line2": "Suite 5", "pin": "01234"}', '111-222-3333', 'Noorani Masjid', 73.88576687440813, 18.468197877031162);


--
-- Data for Name: namaz_timing; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."namaz_timing" ("id", "created_at", "masjid_id", "namaz", "time") VALUES
	(91, '2023-12-16 09:43:52.851058+00', 17, 'fajar', '05:30:00'),
	(92, '2023-12-16 09:43:52.851058+00', 17, 'zohar', '12:30:00'),
	(93, '2023-12-16 09:43:52.851058+00', 17, 'asr', '15:45:00'),
	(94, '2023-12-16 09:43:52.851058+00', 17, 'magrib', '18:00:00'),
	(95, '2023-12-16 09:43:52.851058+00', 17, 'isha', '20:30:00'),
	(96, '2023-12-16 09:43:52.851058+00', 17, 'jummah', '13:00:00'),
	(97, '2023-12-16 09:43:52.851058+00', 18, 'fajar', '05:45:00'),
	(98, '2023-12-16 09:43:52.851058+00', 18, 'zohar', '13:00:00'),
	(99, '2023-12-16 09:43:52.851058+00', 18, 'asr', '16:15:00'),
	(100, '2023-12-16 09:43:52.851058+00', 18, 'magrib', '18:30:00'),
	(101, '2023-12-16 09:43:52.851058+00', 18, 'isha', '21:00:00'),
	(102, '2023-12-16 09:43:52.851058+00', 18, 'jummah', '13:30:00'),
	(103, '2023-12-16 09:43:52.851058+00', 19, 'fajar', '06:00:00'),
	(104, '2023-12-16 09:43:52.851058+00', 19, 'zohar', '12:45:00'),
	(105, '2023-12-16 09:43:52.851058+00', 19, 'asr', '16:30:00'),
	(106, '2023-12-16 09:43:52.851058+00', 19, 'magrib', '18:45:00'),
	(107, '2023-12-16 09:43:52.851058+00', 19, 'isha', '21:15:00'),
	(108, '2023-12-16 09:43:52.851058+00', 19, 'jummah', '14:00:00'),
	(109, '2023-12-16 09:43:52.851058+00', 20, 'fajar', '05:15:00'),
	(110, '2023-12-16 09:43:52.851058+00', 20, 'zohar', '12:15:00'),
	(111, '2023-12-16 09:43:52.851058+00', 20, 'asr', '15:30:00'),
	(112, '2023-12-16 09:43:52.851058+00', 20, 'magrib', '17:45:00'),
	(113, '2023-12-16 09:43:52.851058+00', 20, 'isha', '20:15:00'),
	(114, '2023-12-16 09:43:52.851058+00', 20, 'jummah', '12:45:00'),
	(115, '2023-12-16 09:43:52.851058+00', 21, 'fajar', '05:00:00'),
	(116, '2023-12-16 09:43:52.851058+00', 21, 'zohar', '12:00:00'),
	(117, '2023-12-16 09:43:52.851058+00', 21, 'asr', '15:15:00'),
	(118, '2023-12-16 09:43:52.851058+00', 21, 'magrib', '17:30:00'),
	(119, '2023-12-16 09:43:52.851058+00', 21, 'isha', '20:00:00'),
	(120, '2023-12-16 09:43:52.851058+00', 21, 'jummah', '12:30:00');


--
-- Data for Name: stream; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 14, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: masjid_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."masjid_id_seq"', 21, true);


--
-- Name: namaz_timing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."namaz_timing_id_seq"', 120, true);


--
-- Name: stream_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."stream_id_seq"', 1, false);

--
-- PostgreSQL database dump complete
--

RESET ALL;
