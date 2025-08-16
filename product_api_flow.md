# Product API Flow - Complete Architecture

## Flowchart Overview

```mermaid
graph TD
    %% User Interaction
    A[User navigates to /men route] --> B[MenComponent loads]
    
    %% Component Initialization
    B --> C[ngOnInit executes]
    C --> D[Store.dispatch loadProducts action]
    
    %% NgRx Effects Layer
    D --> E[ProductEffects.loadProducts$ effect]
    E --> F[ofType loadProducts action]
    F --> G[mergeMap to ProductsService.getProducts]
    
    %% HTTP Service Layer
    G --> H[ProductsService.getProducts called]
    H --> I[HttpClient.get request]
    I --> J[GET https://localhost:7106/api/Products]
    
    %% API Response Handling
    J --> K{API Response}
    K -->|Success 200| L[Products data received]
    K -->|Error 4xx/5xx| M[HTTP Error thrown]
    
    %% Success Path
    L --> N[map operator transforms data]
    N --> O[Dispatch loadProductsSuccess action]
    O --> P[ProductReducer handles success]
    P --> Q[Update state: products[], loading: false, error: null]
    
    %% Error Path
    M --> R[catchError operator catches error]
    R --> S[Dispatch loadProductsFailure action]
    S --> T[ProductReducer handles failure]
    T --> U[Update state: loading: false, error: errorMessage]
    
    %% State Management
    Q --> V[Store state updated]
    U --> V
    
    %% Selectors Layer
    V --> W[Selectors read from store]
    W --> X[selectAllProducts selector]
    W --> Y[selectProductsLoading selector]
    W --> Z[selectProductsError selector]
    
    %% Component Data Binding
    X --> AA[MenComponent.products$ observable]
    Y --> BB[MenComponent.loading$ observable]
    Z --> CC[MenComponent.error$ observable]
    
    %% Component State Updates
    AA --> DD[products array updated]
    BB --> EE[loading boolean updated]
    CC --> FF[error object updated]
    
    %% Template Rendering
    DD --> GG[filteredProducts = [...products]]
    EE --> HH[Template shows/hides loading spinner]
    FF --> II[Template shows/hides error message]
    GG --> JJ[Template renders product cards]
    
    %% Final UI State
    HH --> KK[User sees loading state]
    II --> LL[User sees error state]
    JJ --> MM[User sees product grid]
    
    %% Styling
    style A fill:#e3f2fd
    style C fill:#e8f5e8
    style J fill:#fff3e0
    style V fill:#f3e5f5
    style MM fill:#e8f5e8
    style LL fill:#ffebee
    style KK fill:#fff8e1
```

## Detailed File-by-File Flow

### 1. Component Layer (Entry Point)
```mermaid
graph LR
    A[men.component.ts] --> B[ngOnInit]
    B --> C[store.dispatch loadProducts]
    C --> D[store.select selectors]
    D --> E[Template binding]
    
    style A fill:#e3f2fd
```

**Files:**
- `src/app/men/men.component.ts` - Triggers the flow
- `src/app/men/men.component.html` - Displays the results

### 2. NgRx Actions Layer
```mermaid
graph LR
    A[product.actions.ts] --> B[loadProducts action]
    A --> C[loadProductsSuccess action]
    A --> D[loadProductsFailure action]
    
    style A fill:#f3e5f5
```

### 3. NgRx Effects Layer
```mermaid
graph LR
    A[product.effects.ts] --> B[Listen to loadProducts]
    B --> C[Call ProductsService]
    C --> D[Dispatch success/failure]
    
    style A fill:#fff3e0
```

### 4. Service Layer
```mermaid
graph LR
    A[products.service.ts] --> B[HttpClient injection]
    B --> C[getProducts method]
    C --> D[HTTP GET request]
    
    style A fill:#e8f5e8
```

### 5. State Management Layer
```mermaid
graph LR
    A[product.reducer.ts] --> B[Handle loadProducts]
    A --> C[Handle loadProductsSuccess]
    A --> D[Handle loadProductsFailure]
    
    style A fill:#f3e5f5
```

### 6. Selectors Layer
```mermaid
graph LR
    A[product.selectors.ts] --> B[selectAllProducts]
    A --> C[selectProductsLoading]
    A --> D[selectProductsError]
    
    style A fill:#fff8e1
```

## Data Flow Sequence

```mermaid
sequenceDiagram
    participant C as MenComponent
    participant S as Store
    participant E as Effects
    participant P as ProductsService
    participant A as API Server
    participant R as Reducer
    participant SL as Selectors

    C->>S: dispatch(loadProducts)
    S->>E: ofType(loadProducts)
    E->>P: getProducts()
    P->>A: GET /api/Products
    A-->>P: Products data
    P-->>E: Observable<Product[]>
    E->>S: dispatch(loadProductsSuccess)
    S->>R: Update state
    R-->>S: New state
    S->>SL: Selectors read state
    SL-->>C: Observable updates
    C->>C: Update component properties
    C->>C: Template re-renders
```

## Error Handling Flow

```mermaid
graph TD
    A[API Call fails] --> B[catchError in Effects]
    B --> C[Dispatch loadProductsFailure]
    C --> D[Reducer sets error state]
    D --> E[Selectors read error]
    E --> F[Component receives error]
    F --> G[Template shows error message]
    
    style A fill:#ffebee
    style G fill:#ffebee
```

## Loading State Flow

```mermaid
graph TD
    A[loadProducts dispatched] --> B[Reducer sets loading: true]
    B --> C[Selectors read loading state]
    C --> D[Component receives loading: true]
    D --> E[Template shows spinner]
    E --> F[API response received]
    F --> G[Reducer sets loading: false]
    G --> H[Template hides spinner]
    
    style A fill:#fff8e1
    style E fill:#fff8e1
```

## Key Benefits of This Architecture

1. **Predictable State Changes**: All state changes go through actions and reducers
2. **Side Effect Management**: Effects handle async operations cleanly
3. **Reactive Updates**: Components automatically update when state changes
4. **Error Handling**: Centralized error handling through effects
5. **Loading States**: Built-in loading state management
6. **Testability**: Each layer can be tested independently
7. **Scalability**: Easy to add new features without breaking existing code

## File Dependencies

```mermaid
graph TD
    A[app.module.ts] --> B[HttpClientModule]
    A --> C[StoreModule]
    A --> D[EffectsModule]
    
    C --> E[product.reducer.ts]
    D --> F[product.effects.ts]
    F --> G[products.service.ts]
    F --> H[product.actions.ts]
    
    I[men.component.ts] --> H
    I --> J[product.selectors.ts]
    J --> E
    
    style A fill:#e3f2fd
    style I fill:#e8f5e8
```

