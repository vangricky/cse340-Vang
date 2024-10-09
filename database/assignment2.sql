-- In the inventory table, find the inv_make of 'Chevy' query
SELECT * FROM public.inventory
WHERE inv_make = 'Chevy'

-- TASK ONE: Write SQL Statements

-- 1. Adding, updating, then deleting Tony Stark data.
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--  2. Change Tony Stark's account_type to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com'

-- 3. Delete Tony Stark record from database
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4. Modify the 'GM Hummer' record to read 'a huge interior' rather than 'the small interiors'
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer'

-- 5. Use INNER JOIN to select make and model from inv table and classification name field from classification table for inventory items that belong to the 'sport' category
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport'

-- 6. Update all records in the INVENTORY table to add /vehicles the middle of the file path
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
