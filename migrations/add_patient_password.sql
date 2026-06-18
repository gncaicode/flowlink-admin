-- patients 테이블에 password_hash 컬럼 추가
ALTER TABLE patients ADD COLUMN password_hash VARCHAR(255) NULL;
