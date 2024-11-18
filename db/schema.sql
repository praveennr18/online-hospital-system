--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    username character varying(20) NOT NULL,
    password character varying(20)
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- Name: doctor_response; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_response (
    problem_id integer NOT NULL,
    response character varying(100)
);


ALTER TABLE public.doctor_response OWNER TO postgres;

--
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    firstname character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    phonenumber character varying(15) NOT NULL,
    password character varying(255) NOT NULL,
    specialization character varying(255) NOT NULL
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- Name: patient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient (
    firstname character varying(255),
    username character varying(255) NOT NULL,
    phonenumber character varying(15),
    address character varying(255),
    password character varying(255)
);


ALTER TABLE public.patient OWNER TO postgres;

--
-- Name: patient_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_request (
    doctorusername character varying(30),
    problem character varying(230),
    response character varying(255),
    username character varying(30),
    problem_id integer NOT NULL
);


ALTER TABLE public.patient_request OWNER TO postgres;

--
-- Name: patient_request_problem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patient_request_problem_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.patient_request_problem_id_seq OWNER TO postgres;

--
-- Name: patient_request_problem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patient_request_problem_id_seq OWNED BY public.patient_request.problem_id;


--
-- Name: patient_request problem_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_request ALTER COLUMN problem_id SET DEFAULT nextval('public.patient_request_problem_id_seq'::regclass);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (username);


--
-- Name: doctor_response doctor_response_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_response
    ADD CONSTRAINT doctor_response_pkey PRIMARY KEY (problem_id);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (username);


--
-- Name: patient patient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_pkey PRIMARY KEY (username);


--
-- Name: patient_request patient_request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_request
    ADD CONSTRAINT patient_request_pkey PRIMARY KEY (problem_id);


--
-- Name: doctor_response doctor_response_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_response
    ADD CONSTRAINT doctor_response_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.patient_request(problem_id);


--
-- Name: patient_request fk_patient_request_; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_request
    ADD CONSTRAINT fk_patient_request_ FOREIGN KEY (doctorusername) REFERENCES public.doctors(username);


--
-- Name: patient_request fk_patient_request_doctor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_request
    ADD CONSTRAINT fk_patient_request_doctor FOREIGN KEY (doctorusername) REFERENCES public.doctors(username);


--
-- Name: patient_request fk_patient_request_username; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_request
    ADD CONSTRAINT fk_patient_request_username FOREIGN KEY (username) REFERENCES public.patient(username);


--
-- PostgreSQL database dump complete
--

