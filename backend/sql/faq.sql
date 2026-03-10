DROP TABLE IF EXISTS faq;

CREATE TABLE faq (
  id INT AUTO_INCREMENT PRIMARY KEY,
  audience VARCHAR(10) NOT NULL,
  type VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer JSON NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audience (audience),
  INDEX idx_type (type),
  INDEX idx_audience_type_sort (audience, type, sort_order)
);