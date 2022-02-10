# Acceptance criteria

## US 1
1) csv columns: username,email,phone,date
2) Track the uploaded csv files: originalname, filename,size, processed, createdAt
3) Store the following data for every license uploaded: username, email, phone, date, partner, user, sent, createdAt
4) The csv filename will be the name of the partner center
5) Every csv filename stored in the filesystem will have as name the current date plus its original name
6) Once all the valid licenses of a given csv have been imported in DB
 - Mark upload as completed in DB
 - Send related emails with pdf license as attachment
7) Once an email with the license is sent to the cyclist, register the time the email containing the license is sent
8) Avoid inserting licenses with duplicated email or phone
9) Pdf license will be stored in the filesystem with a name resulting from substituting @ and . with the \_ character
10) The csv files processing task should run as an scheduled task, as a separate service from the api.

## US 2
1) Send cyclist email as parameter in api request to indicate whose pdf license is
2) The api response should send back the pdf file, ready to be printed and containing the basic license data

## US 3
1) Once, every night at 23:59:59, a script in charge of sending an email to the owner of BA is executed, containing the summary of all the csv files uploaded and processed in the last 24hours, till 23:59:59.
2) The summary will be in the form of an html table where each row is a record of the completed uploads
3) The fields of the table will be the same fields in the upload collection
