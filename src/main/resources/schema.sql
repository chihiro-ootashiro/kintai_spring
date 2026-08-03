--社員マスタ
CREATE TABLE IF NOT EXISTS m_employee
(
   id integer auto_increment NOT NULL,
   employee_no varchar (10) NOT NULL,
   employee_name varchar (50) NOT NULL,
   email varchar (255) NOT NULL UNIQUE,
   start_date date NOT NULL,
   password varchar (100) NOT NULL,
   role_cd tinyint DEFAULT 0,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   CONSTRAINT m_employee PRIMARY KEY (id)
);

--祝日マスタ
CREATE TABLE IF NOT EXISTS m_holiday
(
   id integer auto_increment NOT NULL,
   yyyymmdd varchar (20) NOT NULL,
   holiday_name varchar (10) NOT NULL,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   CONSTRAINT m_holiday PRIMARY KEY (id)
);

--勤怠ヘッダ
CREATE TABLE IF NOT EXISTS t_attendance_head
(
   id integer auto_increment NOT NULL,
   employee_id integer NOT NULL,
   yyyymm char (6) NOT NULL,
   status char (1) NOT NULL,
   reject_comment varchar (500),
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   CONSTRAINT t_attendance_head PRIMARY KEY (id)
);

--勤怠明細
CREATE TABLE IF NOT EXISTS t_attendance_detail
(
  id integer auto_increment NOT NULL,
  head_id integer NOT NULL,
  day char(2) NOT NULL,
  kdn char(1),
  start_time time,
  end_time time,
  rest_time time,
  night_rest_time time,
  work_time time,
  over_time time,
  remarks varchar(256),
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   CONSTRAINT t_attendance_detail PRIMARY KEY (id)
);