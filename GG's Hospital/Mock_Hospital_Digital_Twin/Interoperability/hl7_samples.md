# HL7 v2 Sample Messages

Sample HL7 v2 messages representing common hospital transactions.

---

## ADT^A01 - Patient Admit

```
MSH|^~\&|HOSPITAL_SYSTEM|GG_HOSPITAL|EMR|GG_HOSPITAL|20250115083000||ADT^A01|MSG00001|P|2.5
EVN|A01|20250115083000
PID|1||MRN123456||Doe^John^A||19650412|M|||123 Main St^^Boston^MA^02101||555-1234|||M||ACC0001|123-45-6789
PV1|1|I|2N^201^A|EMG|||100^Smith^John^A^MD||200^Johnson^Sarah^B^MD|MED||||1|||100^Smith^John^A^MD|INP|ACC0001|||||||||||||||||||GG_HOSPITAL||ACT||||20250115083000
```

**Explanation**: This message indicates John Doe was admitted to room 2N-201A from the emergency department.

---

## ADT^A03 Patient Discharge

```
MSH|^~\&|HOSPITAL_SYSTEM|GG_HOSPITAL|EMR|GG_HOSPITAL|20250117153000||ADT^A03|MSG00002|P|2.5
EVN|A03|20250117153000
PID|1||MRN123456||Doe^John^A||19650412|M|||123 Main St^^Boston^MA^02101||555-1234|||M||ACC0001|123-45-6789
PV1|1|I|2N^201^A|EMG|||100^Smith^John^A^MD||200^Johnson^Sarah^B^MD|MED||||1|||100^Smith^John^A^MD|INP|ACC0001|||||||||||||||||||GG_HOSPITAL||DIS||||20250117153000
PV2|||^Patient improved and stable for discharge to home
```

**Explanation**: John Doe is being discharged home after improvement.

---

## ORU^R01 - Lab Results

```
MSH|^~\&|LAB_SYSTEM|GG_HOSPITAL|EMR|GG_HOSPITAL|20250115100500||ORU^R01|MSG00003|P|2.5
PID|1||MRN789012||Smith^Jane^M||19780322|F|||456 Oak Ave^^Boston^MA^02102||555-5678|||F||ACC0002|987-65-4321
OBR|1|LAB20250115001|LAB20250115001|80053^Comprehensive Metabolic Panel|||20250115080000|20250115090000||100^Johnson^Mark^L^MD||||||||100^Johnson^Mark^L^MD
OBX|1|NM|2345-7^Glucose^LN||95|mg/dL|70-100||||F|||20250115095000
OBX|2|NM|2951-2^Sodium^LN||140|mmol/L|136-145||||F|||20250115095000
OBX|3|NM|2823-3^Potassium^LN||4.2|mmol/L|3.5-5.0||||F|||20250115095000
OBX|4|NM|2160-0^Creatinine^LN||1.8|mg/dL|0.7-1.3||H||F|||20250115095000
OBX|5|NM|3094-0^BUN^LN||25|mg/dL|7-20||H||F|||20250115095000
```

**Explanation**: Lab results for Jane Smith's comprehensive metabolic panel with elevated creatinine and BUN.

---

## ORM^O01 - Order Message

```
MSH|^~\&|CPOE|GG_HOSPITAL|LAB_SYSTEM|GG_HOSPITAL|20250116140000||ORM^O01|MSG00004|P|2.5
PID|1||MRN345678||Williams^Robert^T||19551108|M|||789 Elm St^^Boston^MA^02103||555-9012|||M||ACC0003|567-89-1234
ORC|NW|ORD20250116001|||||^STAT
OBR|1|ORD20250116001||85025^CBC with Differential|||20250116140000||||||Fever and fatigue||100^Chen^Lisa^A^MD||||||||LAB
OBR|2|ORD20250116001||80053^Comprehensive Metabolic Panel|||20250116140000||||||Fever and fatigue||100^Chen^Lisa^A^MD||||||||LAB
```

**Explanation**: STAT orders for CBC and CMP for Robert Williams with fever and fatigue.

---

## ORM^O01 - Imaging Order

```
MSH|^~\&|CPOE|GG_HOSPITAL|RAD_SYSTEM|GG_HOSPITAL|20250116150000||ORM^O01|MSG00005|P|2.5
PID|1||MRN234567||Brown^Mary^E||19620705|F|||321 Pine St^^Boston^MA^02104||555-3456|||F||ACC0004|234-56-7890
ORC|NW|RAD20250116001|||||^ROUTINE
OBR|1|RAD20250116001||71046^Chest X-Ray 2 Views|||20250116150000||||||Cough and shortness of breath||200^Martinez^Carlos^R^MD||||||||RAD
```

**Explanation**: Routine chest X-ray order for Mary Brown with respiratory symptoms.

---

## MDM^T02 - Document Status Change

```
MSH|^~\&|EMR|GG_HOSPITAL|ARCHIVE|GG_HOSPITAL|20250117093000||MDM^T02|MSG00006|P|2.5
EVN|T02|20250117093000
PID|1||MRN456789||Johnson^Michael^P||19880214|M|||654 Maple Dr^^Boston^MA^02105||555-7890|||M||ACC0005|345-67-8901
TXA|1|OP|TEXT|20250117||20250117093000||100^Smith^John^A^MD|300^Lee^Jennifer^B^MD|||DOC20250117001||AU|AV
OBX|1|TX|NOTE||Patient presented with chest pain. EKG showed ...||||||F
```

**Explanation**: Operative note authenticated and available for Michael Johnson.

