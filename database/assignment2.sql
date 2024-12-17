-- Insert new record to the account table
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--
-- Modify the Tony Stark record to change the account_type
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
--
-- Delete the Tony Stark record from the database
DELETE FROM account
WHERE account_email = 'tony@starkent.com';
--
-- Modify the "GM Hummer" record to change part of the description
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
--
-- Inner join to select the make and model fields from the inventory table
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM inventory i
    INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
--
-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns
UPDATE inventory
SET inv_image = REPLACE(
        inv_image,
        '/images/',
        '/images/vehicles/'
    ),
    inv_thumbnail = REPLACE(
        inv_thumbnail,
        '/images/',
        '/images/vehicles/'
    );