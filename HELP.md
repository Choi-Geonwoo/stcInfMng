# 📊 주식정보

## 1. 프로젝트 개요
본 프로젝트는 주식, 배당, 거래내역을 체계적으로 관리하고  
주식 투자 현황을 한눈에 파악할 수 있도록 지원하는 **주식 정보 관리 시스템**입니다.

---

## 2. 개발 환경
| 구분 | 내용 |
|------|------|
| Language | Java 21 |
| Framework | Spring Boot 3.5.7 |
| Build Tool | Gradle |
| Mapper Framework | MyBatis |
| Database | Oracle 21c |

---

## 3. 기술 스택

- Java 21
- Spring Boot 3.5.7
- Gradle
- MyBatis
- Oracle Database 21c
- git

---

## 4. 프로젝트 구조

```text
src
 └─ main
     ├─ java
     │   └─ com.example.demo
     │        └─ alctnDlngDsctn
     │             ├─ controller
     │             ├─ service
     │             ├─ mapper
     │             ├─ dto
     │             └─ config
     └─ resources
         ├─ mapper
         └─ application.yml
```
---
# 📌 Database 설계

## 1. ERD 개요
본 프로젝트는 주식, 배당, 은행, 국가 정보를 중심으로 거래·배당·파일 관리까지 포함하는 구조로 설계되었습니다.

---

## 2. 테이블 목록

| 테이블 | 설명 |
|--------|------|
| STCKINFO | 주식 마스터 |
| STCKDLNGDSCTN | 주식 거래내역 |
| ALCTNDLNGDSCTN | 배당 거래내역 |
| STOCK_BALANCE | 주식 잔고 |
| BNINFR | 은행 마스터 |
| NTNINFO | 국가 마스터 |
| FILEINFO | 첨부파일 |

---

# 3. 테이블 명세

---

## STCKINFO (주식정보)

| 컬럼명 | 타입 | PK | NULL | 설명 |
|------|----|----|----|----|
| STCKINFO_NO | VARCHAR2(10) | PK | N | 주식 순번 |
| NTNCD | VARCHAR2(2) |  | N | 국가코드 |
| STCKTEA | VARCHAR2(10) |  | N | 주식티커 |
| STCKNM | VARCHAR2(50) |  | N | 주식명 |
| ALCTN | VARCHAR2(20) |  | N | 배당주기 |
| USEYN | CHAR(1) |  | N | 사용여부 |
| DELYN | CHAR(1) |  | N | 삭제여부 |
| REGDAY | TIMESTAMP |  | N | 등록일 |
| MDFCNDAY | TIMESTAMP |  | N | 수정일 |

---

## STCKDLNGDSCTN (주식거래내역)

| 컬럼명 | 타입 | PK | NULL | 설명 |
|------|----|----|----|----|
| STCKDLNGDSCTN_NO | VARCHAR2(10) | PK | N | 거래 순번 |
| DLNGYMD | VARCHAR2(10) |  | N | 거래일자 |
| BNCD | VARCHAR2(2) |  | N | 은행코드 |
| STCKTEA | VARCHAR2(10) |  | N | 주식티커 |
| DLNGAMT | VARCHAR2(30) |  | N | 거래금액 |
| CLSF | CHAR(1) |  | Y | 항목구분 |
| BYNGYN | CHAR(1) |  | Y | 매수여부 |
| STCKCNT | VARCHAR2(20) |  | Y | 주식수 |
| DELYN | CHAR(1) |  | N | 삭제여부 |
| REGDAY | TIMESTAMP |  | N | 등록일 |
| MDFCNDAY | TIMESTAMP |  | N | 수정일 |

---

## ALCTNDLNGDSCTN (배당거래내역)

| 컬럼명 | 타입 | PK | NULL | 설명 |
|------|----|----|----|----|
| ALCTNDLNGDSCTN_NO | VARCHAR2(10) | PK | N | 순번 |
| BNCD | VARCHAR2(2) |  | N | 은행코드 |
| STCKTEA | VARCHAR2(10) |  | N | 주식티커 |
| DLNGYMD | VARCHAR2(10) |  | N | 거래일자 |
| DLNGAMT | VARCHAR2(30) |  | N | 거래금액 |
| DVDND | VARCHAR2(10) |  | N | 배당금 |
| FILENM | VARCHAR2(50) |  | Y | 파일명 |
| DELYN | CHAR(1) |  | N | 삭제여부 |
| REGDAY | TIMESTAMP |  | N | 등록일 |
| MDFCNDAY | TIMESTAMP |  | N | 수정일 |

---

## STOCK_BALANCE (주식수량)

| 컬럼명 | 타입 | PK | NULL | 설명 |
|------|----|----|----|----|
| STOCK_BALANCE_NO | VARCHAR2(10) | PK | N | 순번 |
| STCKINFO_NO | VARCHAR2(10) | FK | Y | 주식 순번 |
| QTY | VARCHAR2(10) |  | Y | 보유 수량 |
| DELYN | CHAR(1) |  | N | 삭제여부 |
| REGDAY | TIMESTAMP |  | N | 등록일 |
| MDFCNDAY | TIMESTAMP |  | N | 수정일 |

---

## BNINFR (은행정보)

| 컬럼명 | 타입 | PK | NULL | 설명 |
|------|----|----|----|----|
| BNINFR_NO | VARCHAR2(10) | PK | N | 순번 |
| BNCD | VARCHAR2(2) |  | N | 은행코드 |
| BNNM | VARCHAR2(20) |  | N | 은행명 |
| USEYN | CHAR(1) |  | N | 사용여부 |
| DELYN | CHAR(1) |  | N | 삭제여부 |
| REGDAY | TIMESTAMP |  | N | 등록일 |
| MDFCNDAY | TIMESTAMP |  | N | 수정일 |

---

## NTNINFO (국가정보)

| 컬럼명 | 타입 | PK | NULL | 설명 |
|------|----|----|----|----|
| NTNINFO_NO | VARCHAR2(10) | PK | N | 순번 |
| NTNCD | VARCHAR2(2) |  | N | 국가코드 |
| NTNNM | VARCHAR2(20) |  | N | 국가명 |
| USEYN | CHAR(1) |  | N | 사용여부 |
| DELYN | CHAR(1) |  | N | 삭제여부 |
| REGDAY | TIMESTAMP |  | N | 등록일 |
| MDFCNDAY | TIMESTAMP |  | N | 수정일 |

---

## FILEINFO (파일정보)

| 컬럼명 | 타입 | PK | NULL | 설명 |
|------|----|----|----|----|
| FILEINFO_NO | VARCHAR2(10) | PK | N | 순번 |
| ALCTNDLNGDSCTN_NO | VARCHAR2(10) | FK | N | 배당 거래 순번 |
| FILENM | VARCHAR2(50) |  | Y | 파일명 |
| FILEINFO | BLOB |  | N | 파일 데이터 |
| DELYN | CHAR(1) |  | N | 삭제여부 |
| REGDAY | TIMESTAMP |  | N | 등록일 |
| MDFCNDAY | TIMESTAMP |  | N | 수정일 |

---

# 4. FK 관계

| FK 테이블 | FK 컬럼 | 참조 테이블 |
|----------|--------|------------|
| STCKDLNGDSCTN | STCKTEA | STCKINFO |
| ALCTNDLNGDSCTN | STCKTEA | STCKINFO |
| STOCK_BALANCE | STCKINFO_NO | STCKINFO |
| FILEINFO | ALCTNDLNGDSCTN_NO | ALCTNDLNGDSCTN |
| STCKDLNGDSCTN | BNCD | BNINFR |
| ALCTNDLNGDSCTN | BNCD | BNINFR |
| STCKINFO | NTNCD | NTNINFO |
