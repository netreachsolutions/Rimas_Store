use ecommerce_v2;

SELECT 
  products.product_id, 
  products.name, 
  products.description, 
  products.price, 
  products.stock, 
  product_image.image_url
FROM 
  products
LEFT JOIN 
  product_image 
ON 
  products.product_id = product_image.product_id
  AND (product_image.priority = (
    SELECT MAX(COALESCE(priority, -1)) 
    FROM product_image 
    WHERE product_image.product_id = products.product_id
  ) OR (product_image.priority IS NULL AND NOT EXISTS (
    SELECT 1 
    FROM product_image 
    WHERE product_image.product_id = products.product_id
    AND product_image.priority IS NOT NULL
  )));



