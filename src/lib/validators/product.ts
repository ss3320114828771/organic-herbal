// lib/validators/product.ts

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  success: boolean
  errors: ValidationError[]
}

// Product name validation
export function validateProductName(name: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!name) {
    errors.push({ field: 'name', message: 'Product name is required' })
  } else if (typeof name !== 'string') {
    errors.push({ field: 'name', message: 'Product name must be a string' })
  } else {
    // Length validation
    if (name.length < 3) {
      errors.push({ field: 'name', message: 'Product name must be at least 3 characters' })
    }
    if (name.length > 100) {
      errors.push({ field: 'name', message: 'Product name must be less than 100 characters' })
    }

    // Character validation
    const nameRegex = /^[A-Za-z0-9\s\-'&.]+$/
    if (!nameRegex.test(name)) {
      errors.push({ field: 'name', message: 'Product name can only contain letters, numbers, spaces, hyphens, apostrophes, ampersands, and periods' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Product description validation
export function validateProductDescription(description?: string): ValidationResult {
  const errors: ValidationError[] = []

  if (description) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' })
    } else if (description.length > 2000) {
      errors.push({ field: 'description', message: 'Description must be less than 2000 characters' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Price validation
export function validatePrice(price: number): ValidationResult {
  const errors: ValidationError[] = []

  if (price === undefined || price === null) {
    errors.push({ field: 'price', message: 'Price is required' })
  } else if (typeof price !== 'number') {
    errors.push({ field: 'price', message: 'Price must be a number' })
  } else if (isNaN(price)) {
    errors.push({ field: 'price', message: 'Price must be a valid number' })
  } else if (price < 0) {
    errors.push({ field: 'price', message: 'Price cannot be negative' })
  } else if (price > 1000000) {
    errors.push({ field: 'price', message: 'Price cannot exceed 1,000,000' })
  } else if (!/^\d+(\.\d{1,2})?$/.test(price.toString())) {
    errors.push({ field: 'price', message: 'Price can only have up to 2 decimal places' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Compare price validation
export function validateComparePrice(price: number, comparePrice?: number): ValidationResult {
  const errors: ValidationError[] = []

  if (comparePrice !== undefined && comparePrice !== null) {
    if (typeof comparePrice !== 'number') {
      errors.push({ field: 'comparePrice', message: 'Compare price must be a number' })
    } else if (isNaN(comparePrice)) {
      errors.push({ field: 'comparePrice', message: 'Compare price must be a valid number' })
    } else if (comparePrice < 0) {
      errors.push({ field: 'comparePrice', message: 'Compare price cannot be negative' })
    } else if (comparePrice > 1000000) {
      errors.push({ field: 'comparePrice', message: 'Compare price cannot exceed 1,000,000' })
    } else if (comparePrice <= price) {
      errors.push({ field: 'comparePrice', message: 'Compare price must be greater than regular price' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// SKU validation
export function validateSKU(sku: string): ValidationResult {
  const errors: ValidationError[] = []

  if (sku) {
    if (typeof sku !== 'string') {
      errors.push({ field: 'sku', message: 'SKU must be a string' })
    } else {
      if (sku.length < 3) {
        errors.push({ field: 'sku', message: 'SKU must be at least 3 characters' })
      }
      if (sku.length > 50) {
        errors.push({ field: 'sku', message: 'SKU must be less than 50 characters' })
      }

      const skuRegex = /^[A-Za-z0-9\-_]+$/
      if (!skuRegex.test(sku)) {
        errors.push({ field: 'sku', message: 'SKU can only contain letters, numbers, hyphens, and underscores' })
      }
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Stock validation
export function validateStock(stock: number): ValidationResult {
  const errors: ValidationError[] = []

  if (stock === undefined || stock === null) {
    errors.push({ field: 'stock', message: 'Stock is required' })
  } else if (typeof stock !== 'number') {
    errors.push({ field: 'stock', message: 'Stock must be a number' })
  } else if (isNaN(stock)) {
    errors.push({ field: 'stock', message: 'Stock must be a valid number' })
  } else if (!Number.isInteger(stock)) {
    errors.push({ field: 'stock', message: 'Stock must be a whole number' })
  } else if (stock < 0) {
    errors.push({ field: 'stock', message: 'Stock cannot be negative' })
  } else if (stock > 999999) {
    errors.push({ field: 'stock', message: 'Stock cannot exceed 999,999' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Category validation
export function validateCategory(category: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!category) {
    errors.push({ field: 'category', message: 'Category is required' })
  } else if (typeof category !== 'string') {
    errors.push({ field: 'category', message: 'Category must be a string' })
  } else {
    if (category.length < 2) {
      errors.push({ field: 'category', message: 'Category must be at least 2 characters' })
    }
    if (category.length > 50) {
      errors.push({ field: 'category', message: 'Category must be less than 50 characters' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Tags validation
export function validateTags(tags: string[]): ValidationResult {
  const errors: ValidationError[] = []

  if (tags) {
    if (!Array.isArray(tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array' })
    } else {
      if (tags.length > 10) {
        errors.push({ field: 'tags', message: 'Cannot have more than 10 tags' })
      }

      tags.forEach((tag, index) => {
        if (typeof tag !== 'string') {
          errors.push({ field: `tags[${index}]`, message: 'Each tag must be a string' })
        } else if (tag.length < 1) {
          errors.push({ field: `tags[${index}]`, message: 'Tag cannot be empty' })
        } else if (tag.length > 30) {
          errors.push({ field: `tags[${index}]`, message: 'Tag must be less than 30 characters' })
        }
      })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Weight validation
export function validateWeight(weight?: number): ValidationResult {
  const errors: ValidationError[] = []

  if (weight !== undefined && weight !== null) {
    if (typeof weight !== 'number') {
      errors.push({ field: 'weight', message: 'Weight must be a number' })
    } else if (isNaN(weight)) {
      errors.push({ field: 'weight', message: 'Weight must be a valid number' })
    } else if (weight < 0) {
      errors.push({ field: 'weight', message: 'Weight cannot be negative' })
    } else if (weight > 100000) {
      errors.push({ field: 'weight', message: 'Weight cannot exceed 100,000' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Dimensions validation
export function validateDimensions(dimensions?: {
  length: number
  width: number
  height: number
  unit: 'cm' | 'in'
}): ValidationResult {
  const errors: ValidationError[] = []

  if (dimensions) {
    if (typeof dimensions !== 'object') {
      errors.push({ field: 'dimensions', message: 'Dimensions must be an object' })
    } else {
      // Length validation
      if (dimensions.length === undefined) {
        errors.push({ field: 'dimensions.length', message: 'Length is required' })
      } else if (typeof dimensions.length !== 'number') {
        errors.push({ field: 'dimensions.length', message: 'Length must be a number' })
      } else if (dimensions.length < 0) {
        errors.push({ field: 'dimensions.length', message: 'Length cannot be negative' })
      } else if (dimensions.length > 1000) {
        errors.push({ field: 'dimensions.length', message: 'Length cannot exceed 1000' })
      }

      // Width validation
      if (dimensions.width === undefined) {
        errors.push({ field: 'dimensions.width', message: 'Width is required' })
      } else if (typeof dimensions.width !== 'number') {
        errors.push({ field: 'dimensions.width', message: 'Width must be a number' })
      } else if (dimensions.width < 0) {
        errors.push({ field: 'dimensions.width', message: 'Width cannot be negative' })
      } else if (dimensions.width > 1000) {
        errors.push({ field: 'dimensions.width', message: 'Width cannot exceed 1000' })
      }

      // Height validation
      if (dimensions.height === undefined) {
        errors.push({ field: 'dimensions.height', message: 'Height is required' })
      } else if (typeof dimensions.height !== 'number') {
        errors.push({ field: 'dimensions.height', message: 'Height must be a number' })
      } else if (dimensions.height < 0) {
        errors.push({ field: 'dimensions.height', message: 'Height cannot be negative' })
      } else if (dimensions.height > 1000) {
        errors.push({ field: 'dimensions.height', message: 'Height cannot exceed 1000' })
      }

      // Unit validation
      if (!dimensions.unit) {
        errors.push({ field: 'dimensions.unit', message: 'Unit is required' })
      } else if (!['cm', 'in'].includes(dimensions.unit)) {
        errors.push({ field: 'dimensions.unit', message: 'Unit must be either "cm" or "in"' })
      }
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Complete product validation
export function validateProduct(data: {
  name: string
  description?: string
  price: number
  comparePrice?: number
  sku?: string
  stock: number
  category: string
  tags?: string[]
  weight?: number
  dimensions?: any
}): ValidationResult {
  const nameValidation = validateProductName(data.name)
  const descriptionValidation = validateProductDescription(data.description)
  const priceValidation = validatePrice(data.price)
  const comparePriceValidation = validateComparePrice(data.price, data.comparePrice)
  const skuValidation = validateSKU(data.sku || '')
  const stockValidation = validateStock(data.stock)
  const categoryValidation = validateCategory(data.category)
  const tagsValidation = validateTags(data.tags || [])
  const weightValidation = validateWeight(data.weight)
  const dimensionsValidation = validateDimensions(data.dimensions)

  const errors = [
    ...nameValidation.errors,
    ...descriptionValidation.errors,
    ...priceValidation.errors,
    ...comparePriceValidation.errors,
    ...skuValidation.errors,
    ...stockValidation.errors,
    ...categoryValidation.errors,
    ...tagsValidation.errors,
    ...weightValidation.errors,
    ...dimensionsValidation.errors
  ]

  return {
    success: errors.length === 0,
    errors
  }
}

// Bulk product validation
export function validateBulkProducts(products: any[]): ValidationResult {
  const errors: ValidationError[] = []

  if (!Array.isArray(products)) {
    errors.push({ field: 'products', message: 'Products must be an array' })
  } else if (products.length === 0) {
    errors.push({ field: 'products', message: 'At least one product is required' })
  } else if (products.length > 100) {
    errors.push({ field: 'products', message: 'Cannot upload more than 100 products at once' })
  } else {
    products.forEach((product, index) => {
      const result = validateProduct(product)
      result.errors.forEach(error => {
        errors.push({
          field: `products[${index}].${error.field}`,
          message: error.message
        })
      })
    })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Get formatted error messages
export function getFormattedErrors(result: ValidationResult): Record<string, string> {
  const formatted: Record<string, string> = {}
  result.errors.forEach(error => {
    formatted[error.field] = error.message
  })
  return formatted
}

// Check if field has error
export function hasError(result: ValidationResult, field: string): boolean {
  return result.errors.some(error => error.field === field)
}

// Get error message for field
export function getError(result: ValidationResult, field: string): string | undefined {
  const error = result.errors.find(e => e.field === field)
  return error?.message
}

// Example usage
export function example() {
  // Validate single product
  const productData = {
    name: 'Premium T-Shirt',
    description: 'High-quality cotton t-shirt',
    price: 29.99,
    comparePrice: 39.99,
    sku: 'TS-001',
    stock: 100,
    category: 'Clothing',
    tags: ['men', 'summer'],
    weight: 0.5,
    dimensions: {
      length: 30,
      width: 20,
      height: 1,
      unit: 'cm'
    }
  }

  const result = validateProduct(productData)
  
  if (!result.success) {
    const errors = getFormattedErrors(result)
    console.log('Validation errors:', errors)
  }

  // Validate price
  const priceResult = validatePrice(29.99)
  if (priceResult.success) {
    console.log('Price is valid')
  }

  // Check specific field
  const stockResult = validateStock(100)
  if (hasError(stockResult, 'stock')) {
    console.log('Stock error:', getError(stockResult, 'stock'))
  }
}