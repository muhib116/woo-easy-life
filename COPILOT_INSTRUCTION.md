# 🎯 Copilot Instruction: SMS Configuration Dashboard Module

**Last Updated:** January 24, 2026  
**Framework:** Vue 3 + TypeScript  
**Architecture:** Composition API with Composables (Provide/Inject Pattern)

---

## 📋 Project Overview

This is a **Vue 3 SMS Configuration Dashboard** built with:
- **State Management:** Composition API Composables
- **UI Components:** Custom component library (@components)
- **Styling:** Tailwind CSS
- **Architecture:** Container/Presentational with Slot-based extensibility
- **API Integration:** RESTful async/await pattern

The entire codebase follows a consistent pattern that must be replicated for any new feature modules.

---

## 🏗️ Core Architecture Pattern

### **Directory Structure Template**

```
config/
├── smsConfig/                   # Feature module
│   ├── Index.vue                # Container (Provider)
│   ├── Create.vue               # Form component
│   ├── Edit.vue                 # Edit wrapper
│   ├── List.vue                 # Display/List component
│   ├── useSmsConfig.ts          # Composable (state + logic)
│   └── fragments/
│       ├── TableRow.vue         # Individual row with actions
│       └── TextInputArea.vue    # Custom input component (if needed)
```

---

## 💾 Composable Pattern (`useSmsConfig.ts`)

### **Structure & Responsibilities**

The composable is the **single source of truth** containing:
- ✅ All reactive state (`ref()`)
- ✅ All business logic
- ✅ All API calls
- ✅ Validation logic
- ✅ Alert/notification management
- ✅ Component mapping
- ✅ Tab/navigation management

### **Template Code**

```typescript
import { createOrUpdateWPOption, createXxx, deleteXxx, getXxx, updateXxx } from "@/api"
import { onMounted, ref } from "vue"
import List from './List.vue'
import Create from './Create.vue'

export const useXxxConfig = () => {
    // ===== STATE =====
    const isLoading = ref(false)
    const activeTab = ref('list')
    const hasUnsavedData = ref(false)
    
    const alertMessage = ref<{
        message: string
        type: "success" | "danger" | "warning" | "info" | ''
    }>({
        message: '',
        type: 'danger'
    })

    // Form state
    const defaultFormData = {
        status: '',
        message: '',
        phone_number: '',
        message_for: '',
        is_active: true
    }
    const form = ref({ ...defaultFormData })

    // List data
    const items = ref([])

    // Options/Dropdowns
    const wooStatuses = ref([])
    const messageFor = [
        { title: 'Admin', slug: 'admin' },
        { title: 'Customer', slug: 'customer' }
    ]

    // Component mapping
    const tabs = ref([
        { title: 'List', slug: 'list' },
        { title: 'Create', slug: 'create' }
    ])
    const components = ref({
        list: List,
        create: Create
    })

    // ===== METHODS =====

    // Tab management
    const tabChange = (slug: string) => {
        activeTab.value = slug
        form.value = { ...defaultFormData }
    }

    // Load data
    const loadItems = async () => {
        isLoading.value = true
        try {
            const { data } = await getXxx()
            items.value = data
        } finally {
            isLoading.value = false
        }
    }

    const loadDropdownData = async () => {
        try {
            isLoading.value = true
            const { data } = await getWoocomerceStatuses()
            wooStatuses.value = data
        } finally {
            isLoading.value = false
        }
    }

    // CREATE
    const handleCreateXxx = async (btn, payload) => {
        // Validation
        if (payload.status == '' || payload.message == '') {
            alertMessage.value.message = `The fields marked with an asterisk (*) are mandatory.`
            alertMessage.value.type = 'warning'
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 6000)
            return
        }

        try {
            isLoading.value = true
            btn.isLoading = true
            const res = await createXxx(payload)
            if (res.status == "success") {
                alertMessage.value.message = res.message
                alertMessage.value.type = 'success'
                form.value = { ...defaultFormData }
                loadItems() // Refresh list
            }
        } catch ({ response }) {
            if (response.data.status == "error") {
                alertMessage.value.message = response.data.message
                alertMessage.value.type = 'danger'
            }
        } finally {
            isLoading.value = false
            btn.isLoading = false

            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 4000)
        }
    }

    // UPDATE
    const handleUpdateXxx = async (btn, payload) => {
        // Same validation as create
        if (payload.status == '' || payload.message == '') {
            alertMessage.value.message = `The fields marked with an asterisk (*) are mandatory.`
            alertMessage.value.type = 'warning'
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 6000)
            return
        }

        try {
            btn.isLoading = true
            isLoading.value = true
            const res = await updateXxx(payload)
            if (res.status == "success") {
                alertMessage.value.message = res.message
                alertMessage.value.type = 'success'
                form.value = { ...defaultFormData }
                loadItems()
            }
        } catch ({ response }) {
            if (response.data.status == "error") {
                alertMessage.value.message = response.data.message
                alertMessage.value.type = 'danger'
            }
        } finally {
            btn.isLoading = false
            isLoading.value = false
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 4000)
        }
    }

    // DELETE
    const handleDeleteXxx = async (id: number, btn: any) => {
        if (!confirm('Are you sure to delete this item?')) return
        try {
            btn.isLoading = true
            const res = await deleteXxx(id)
            if (res.status == "success") {
                alertMessage.value.message = res.message
                alertMessage.value.type = 'success'
                loadItems()
            }
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 4000)
        } finally {
            btn.isLoading = false
        }
    }

    // ===== RETURN =====
    return {
        tabs,
        components,
        tabChange,
        form,
        messageFor,
        alertMessage,
        loadItems,
        items,
        isLoading,
        activeTab,
        hasUnsavedData,
        handleCreateXxx,
        handleDeleteXxx,
        handleUpdateXxx,
        wooStatuses,
        loadDropdownData
    }
}
```

---

## 🎨 Component Pattern: Index.vue (Container)

### **Purpose**
- Orchestrate layout and navigation
- Provide composable to all children
- Manage global UI state (Loader, TabHeader)
- **Never** handle business logic

### **Template**

```vue
<template>
    <div class="relative">
        <Loader
            class="absolute inset-1/2 top-20 -translate-x-1/2 -translate-y-1/2"
            :active="isLoading"
        />
        <TabHeader
            :activeTab="activeTab"
            :data="tabs"
            :hasUnsavedData="hasUnsavedData"
            @onTabChange="tabChange"
        />
        <Card.Native
            class="min-h-[200px] h-full w-full px-0 md:p-4 rounded-t-none md:py-10 shadow-none md:shadow-md"
        >
            <component
                :is="components[activeTab]"
            />
        </Card.Native>
    </div>
</template>

<script setup lang="ts">
    import { Card, Loader } from '@components'
    import { useXxxConfig } from './useXxxConfig'
    import { provide } from 'vue'
    import TabHeader from '@/pages/config/fragments/TabHeader.vue'

    const _useXxxConfig = useXxxConfig()
    const {
        isLoading,
        components,
        activeTab,
        tabs,
        hasUnsavedData,
        tabChange
    } = _useXxxConfig

    provide('useXxxConfig', _useXxxConfig)
</script>
```

**Key Points:**
- ✅ Single `provide()` call with full composable
- ✅ Destructure only what's needed for layout
- ✅ Use dynamic component rendering: `components[activeTab]`
- ✅ No mutation of state (all state management in composable)

---

## 📝 Component Pattern: Create.vue (Form)

### **Purpose**
- Render form UI
- Validate on input
- Inject and use composable methods
- Accept `hideTitle` prop for reusability in Edit mode

### **Template**

```vue
<template>
    <div class="max-w-[500px] mx-auto">
        <MessageBox
            :title="alertMessage.message"
            :type="alertMessage.type"
        />
        <Loader
            class="absolute inset-1/2 z-20"
            :active="isLoading"
        />
        <Heading
            v-if="!hideTitle"
            class="mb-3"
            title="Create message"
        />
    
        <div class="grid gap-4">
            <Select.Primary
                label="Select Status *"
                :options="wooStatuses"
                itemKey="slug"
                v-model="form.status"
            />
            <Select.Primary
                label="Select Receiver *"
                :options="messageFor"
                itemKey="slug"
                v-model="form.message_for"
            />
            <Input.Primary
                v-if="form.message_for == 'admin'"
                label="Admin Phone Number *"
                placeholder="Enter admin phone number"
                v-model="form.phone_number"
                @onInput="validate"
            />
            <TextInputArea
                label="Message *"
                placeholder="Write message"
                :dropdownData="personalizations"
                v-model="form.message"
                position="up"
            />
    
            <div class="flex gap-4 items-center">
                Active
                <Switch v-model="form.is_active"/>
            </div>
        </div>
    
        <slot name="btn">
            <Button.Primary
                class="mt-4 ml-auto"
                @onClick="btn => handleCreateXxx(btn, form)"
            >
                Save Changes
            </Button.Primary>
        </slot>
    </div>
</template>

<script setup lang="ts">
    import { Select, Button, Heading, Loader, MessageBox, Switch, Input } from '@components'
    import { inject, onMounted } from 'vue'
    import TextInputArea from './fragments/TextInputArea.vue'

    withDefaults(
        defineProps<{hideTitle: boolean}>()
    , {
        hideTitle: false
    })

    const {
        form,
        wooStatuses,
        personalizations,
        handleCreateXxx,
        isLoading,
        alertMessage,
        loadDropdownData,
        messageFor
    } = inject('useXxxConfig')

    onMounted(async () => {
        await loadDropdownData()
    })
</script>
```

**Key Points:**
- ✅ `withDefaults(defineProps<{}>(), {})` for prop defaults
- ✅ Inject composable: `const { ... } = inject('useXxxConfig')`
- ✅ Load data in `onMounted()` via injected methods
- ✅ `<slot name="btn">` for flexible button customization
- ✅ v-model binding directly to form properties
- ✅ Show MessageBox for alerts

---

## 📋 Component Pattern: List.vue (Display)

### **Purpose**
- Display list of items in table or grid
- Show empty state with CTA
- Delegate row actions to TableRow component
- Load data on mount

### **Template**

```vue
<template>
    <div
        v-if="items?.length"
        class="relative"
    >
        <MessageBox
            :title="alertMessage.message"
            :type="alertMessage.type"
        />
        <div class="mb-2">
            <h3 class="font-semibold text-gray-900">Item list</h3>
        </div>
        <Table.Table>
            <Table.THead class="whitespace-nowrap">
                <Table.Th>#SL</Table.Th>
                <Table.Th>Column 1</Table.Th>
                <Table.Th>Column 2</Table.Th>
                <Table.Th class="text-right">Action</Table.Th>
            </Table.THead>
            <Table.TBody>
                <TableRow
                    v-for="(item, index) in items"
                    :key="index"
                    :index="index"
                    :item="item"
                />
            </Table.TBody>
        </Table.Table>
    </div>
    <div 
        v-else-if="!isLoading"
        class="text-center text-gray-300 flex flex-col items-center gap-4"
    >
        No items available
        <Button.Primary
            class="px-auto animate-bounce"
            @click="tabChange('create')"
        >
            Create Item
        </Button.Primary>
    </div>
</template>

<script setup lang="ts">
    import { Table, MessageBox, Button } from '@components'
    import { inject, onMounted } from 'vue'
    import TableRow from './fragments/TableRow.vue'

    const {
        isLoading,
        items,
        tabChange,
        loadItems,
        alertMessage
    } = inject('useXxxConfig')

    onMounted(() => {
        loadItems()
    })
</script>
```

**Key Points:**
- ✅ Load data in `onMounted()`
- ✅ Show empty state with CTA button
- ✅ Delegate to TableRow component for individual items
- ✅ Use v-if for conditional rendering
- ✅ Show MessageBox for alerts

---

## 🔄 Component Pattern: TableRow.vue (Individual Row)

### **Purpose**
- Render single table row
- Handle edit/delete actions
- Show edit modal inline

### **Template**

```vue
<template>
    <Table.Tr>
        <Table.Td>{{ index + 1 }}</Table.Td>
        <Table.Td>{{ item.status }}</Table.Td>
        <Table.Td>{{ item.message }}</Table.Td>
        <Table.Td class="text-right">
            <ThreeDotActionButton
                :edit="() => toggleEdit = true"
                :delete="(btn) => handleDeleteXxx(item.id, btn)"
            />
        </Table.Td>
    </Table.Tr>

    <Modal 
        v-model="toggleEdit"
        @close="toggleEdit = false"
        title="Update Item"
    >
        <Edit
            :item="item"
            @onUpdate="toggleEdit = false"
        />
    </Modal>
</template>

<script setup lang="ts">
    import { inject, ref } from 'vue'
    import { Table, ThreeDotActionButton, Modal } from '@components'
    import Edit from '../Edit.vue'

    defineProps<{
        index: number
        item: any
    }>()

    const toggleEdit = ref(false)
    const { handleDeleteXxx } = inject('useXxxConfig')
</script>
```

**Key Points:**
- ✅ Accept `index` and `item` as props
- ✅ Use Modal for inline editing
- ✅ Inject only needed methods
- ✅ Use ThreeDotActionButton for actions
- ✅ Pass item to Edit component via prop

---

## ✏️ Component Pattern: Edit.vue (Edit Wrapper)

### **Purpose**
- Wrap Create.vue for editing
- Override button slot with "Update" action
- Pre-fill form data
- Emit custom events

### **Template**

```vue
<template>
    <div class="w-[500px]">
        <Create
            hideTitle
        >
            <template #btn>
                <Button.Primary
                    @onClick="async (btn) => {
                        await handleUpdateXxx(btn, form)
                        $emit('onUpdate')
                    }"
                    class="ml-auto"
                >
                    Update Item
                </Button.Primary>
            </template>
        </Create>
    </div>
</template>

<script setup lang="ts">
    import { inject, onMounted } from 'vue'
    import Create from './Create.vue'
    import { Button } from '@components'

    const props = defineProps<{
        item: object
    }>()

    const {
        form,
        handleUpdateXxx
    } = inject('useXxxConfig')

    onMounted(() => {
        form.value = {...props.item}
    })
</script>
```

**Key Points:**
- ✅ Pass `hideTitle` to Create component
- ✅ Override slot with update button
- ✅ Pre-fill form in `onMounted()`
- ✅ Emit `@onUpdate` event to parent
- ✅ Use spread operator for object copying: `{...props.item}`

---

## 🎯 Dropdown Data Pattern

### **Structure**

All dropdown/selection data must follow this structure:

```typescript
const optionsList = [
    { title: 'Display Text', slug: 'unique_identifier' },
    { title: 'Another Option', slug: 'another_id' }
]

// Usage in Select component
<Select.Primary
    label="Select Option *"
    :options="optionsList"
    itemKey="slug"
    v-model="form.fieldName"
/>
```

**Rules:**
- ✅ `title`: Human-readable display text
- ✅ `slug`: Unique machine-readable identifier
- ✅ `itemKey="slug"` in component binding
- ✅ `v-model` bound to form field

---

## 🔔 Alert & Notification System

### **Alert Types**

```typescript
type AlertType = "success" | "danger" | "warning" | "info" | ''
```

### **Usage Pattern**

```typescript
// Validation error (6 second display)
alertMessage.value = {
    message: 'The fields marked with an asterisk (*) are mandatory.',
    type: 'warning'
}
setTimeout(() => {
    alertMessage.value = { message: '', type: '' }
}, 6000)

// Success (4 second display)
alertMessage.value = { message: 'Item created successfully!', type: 'success' }
setTimeout(() => {
    alertMessage.value = { message: '', type: '' }
}, 4000)

// Error (4 second display)
alertMessage.value = { message: response.data.message, type: 'danger' }
setTimeout(() => {
    alertMessage.value = { message: '', type: '' }
}, 4000)
```

**Display Durations:**
- ⚠️ Warning: 6000ms
- ✅ Success: 4000ms
- ❌ Error: 4000ms
- ℹ️ Info: 4000ms

---

## 🔘 Button Loading States

### **Pattern**

```typescript
const handleAction = async (btn, payload) => {
    try {
        btn.isLoading = true          // Individual button loading
        isLoading.value = true        // Global page loading
        
        const res = await apiCall()
        
        // Handle response
    } catch (error) {
        // Handle error
    } finally {
        btn.isLoading = false         // Always cleanup
        isLoading.value = false
    }
}
```

**Usage in Template:**
```vue
<Button.Primary
    @onClick="btn => handleCreateXxx(btn, form)"
>
    Save Changes
</Button.Primary>
```

The button component automatically receives the `btn` reference with `isLoading` property.

---

## 📐 Validation Pattern

### **In Composable (Before API Call)**

```typescript
const handleCreateXxx = async (btn, payload) => {
    // Required field validation
    if (payload.status == '' || payload.message == '') {
        alertMessage.value.message = `The fields marked with an asterisk (*) are mandatory.`
        alertMessage.value.type = 'warning'
        setTimeout(() => {
            alertMessage.value = { message: '', type: '' }
        }, 6000)
        return
    }

    // Phone number validation
    if (payload.message_for == 'admin' && !validateBDPhoneNumber(payload.phone_number)) {
        alertMessage.value.message = `Phone number is not valid.`
        alertMessage.value.type = 'warning'
        setTimeout(() => {
            alertMessage.value = { message: '', type: '' }
        }, 6000)
        return
    }

    // Proceed with API call only if validation passes
    try {
        // API call
    } catch (error) {
        // Handle error
    }
}
```

**Rules:**
- ✅ All validation happens in composable
- ✅ Show alert before returning early
- ✅ Never send invalid data to API
- ✅ Display validation errors for 6 seconds

---

## 🔌 API Integration Pattern

### **In Composable**

```typescript
import { createXxx, getXxx, updateXxx, deleteXxx } from "@/api"

// GET (Load data)
const loadItems = async () => {
    isLoading.value = true
    try {
        const { data } = await getXxx()
        items.value = data
    } finally {
        isLoading.value = false
    }
}

// CREATE
const handleCreateXxx = async (btn, payload) => {
    // Validation...
    try {
        btn.isLoading = true
        const res = await createXxx(payload)
        if (res.status == "success") {
            alertMessage.value = { message: res.message, type: 'success' }
            form.value = { ...defaultFormData }
        }
    } catch ({ response }) {
        alertMessage.value = { message: response.data.message, type: 'danger' }
    } finally {
        btn.isLoading = false
    }
}

// UPDATE
const handleUpdateXxx = async (btn, payload) => {
    // Similar to CREATE, but call updateXxx()
}

// DELETE
const handleDeleteXxx = async (id: number, btn: any) => {
    if (!confirm('Are you sure?')) return
    try {
        btn.isLoading = true
        const res = await deleteXxx(id)
        if (res.status == "success") {
            alertMessage.value = { message: res.message, type: 'success' }
            loadItems() // Refresh
        }
    } finally {
        btn.isLoading = false
    }
}
```

**Rules:**
- ✅ All API calls in composable
- ✅ Use try-catch-finally pattern
- ✅ Check `res.status == "success"` for success
- ✅ Extract error from `response.data.message`
- ✅ Refresh list after create/update/delete
- ✅ Always cleanup `isLoading` in finally

---

## 📱 Responsive Design Guidelines

### **Tailwind Classes Usage**

```vue
<!-- Mobile-first approach -->
<div class="px-4 md:px-0">                      <!-- Padding responsive -->
<Card.Native class="px-0 md:p-4">               <!-- Card padding -->
<div class="max-w-[500px] mx-auto">             <!-- Max width container -->
<div class="whitespace-nowrap">                 <!-- Text overflow handling -->
```

**Responsive Breakpoints:**
- 📱 Base: Mobile
- 🖥️ `md:`: Tablet/Desktop (768px+)
- 🖥️ `lg:`: Large Desktop (1024px+)

---

## ✅ Best Practices Checklist

### **Code Organization**
- [ ] All state in composable (no component state)
- [ ] All business logic in composable
- [ ] All API calls in composable
- [ ] Components only handle UI and injection

### **Form Management**
- [ ] Use `defaultFormData` object
- [ ] Reset form after success: `form.value = { ...defaultFormData }`
- [ ] Use spread operator for object copying
- [ ] Validate before API call

### **Error Handling**
- [ ] Try-catch-finally for all async operations
- [ ] Extract error message from `response.data.message`
- [ ] Show user-friendly error messages
- [ ] Auto-dismiss alerts after timeout

### **Loading States**
- [ ] Set `btn.isLoading` for individual buttons
- [ ] Set `isLoading.value` for global page loader
- [ ] Always cleanup in finally block
- [ ] Disable buttons during loading

### **Type Safety**
- [ ] Define TypeScript interfaces for forms
- [ ] Type all function parameters
- [ ] Type all return values
- [ ] Use proper type hints in injection

### **Performance**
- [ ] Use `v-if` not `v-show` for conditional rendering
- [ ] Lazy-load heavy components
- [ ] Cache API responses where appropriate
- [ ] Avoid unnecessary re-renders

### **Accessibility**
- [ ] Use semantic HTML
- [ ] Add `title` attributes to buttons
- [ ] Proper labels for form inputs
- [ ] Keyboard navigation support

### **Consistency**
- [ ] Follow exact component structure
- [ ] Use same naming conventions
- [ ] Match styling patterns (Tailwind)
- [ ] Use same component library (@components)

---

## 🚀 Quick Feature Creation Checklist

When creating a new feature module (e.g., `emailConfig`):

### **Step 1: Setup**
- [ ] Create folder: `config/emailConfig/`
- [ ] Copy structure from `smsConfig/`
- [ ] Rename all `sms` to `email`

### **Step 2: Composable**
- [ ] Create `useEmailConfig.ts`
- [ ] Define default form data
- [ ] Create CRUD methods
- [ ] Add validation logic
- [ ] Set up alert system
- [ ] Define dropdown options

### **Step 3: Components**
- [ ] Create `Index.vue` (copy and modify)
- [ ] Create `Create.vue` (form)
- [ ] Create `List.vue` (display)
- [ ] Create `Edit.vue` (wrapper)
- [ ] Create `fragments/TableRow.vue` (row)

### **Step 4: API Integration**
- [ ] Define API functions in `@/api`
- [ ] Import in composable
- [ ] Call in CRUD methods
- [ ] Handle responses/errors

### **Step 5: Testing**
- [ ] Test create functionality
- [ ] Test edit functionality
- [ ] Test delete functionality
- [ ] Test validation
- [ ] Test on mobile (responsive)
- [ ] Test error handling

### **Step 6: Polish**
- [ ] Add proper labels/placeholders
- [ ] Improve UI/styling
- [ ] Add loading states
- [ ] Test accessibility
- [ ] Code review

---

## 🔗 File References

**Key Files in This Project:**
- `useSmsConfig.ts` - Composable example
- `Index.vue` - Container example
- `Create.vue` - Form example
- `List.vue` - Display example
- `Edit.vue` - Edit wrapper example
- `fragments/TableRow.vue` - Row component example
- `fragments/TextInputArea.vue` - Custom input example

---

## 📝 Example: Complete Feature Module

### **Directory Structure**
```
emailConfig/
├── Index.vue
├── Create.vue
├── Edit.vue
├── List.vue
├── useEmailConfig.ts
└── fragments/
    └── TableRow.vue
```

### **Key Differences from SMS Config**
- Form fields: `template_name`, `subject`, `body`, `recipient_type`
- Validation: Email format validation instead of phone
- Personalizations: Email-specific tokens
- Dropdowns: Email templates, recipient groups

---

## 🎓 Learning Resources

**This instruction follows:**
- Vue 3 Composition API best practices
- TypeScript strict mode
- Tailwind CSS responsive design patterns
- RESTful API design patterns
- Component composition principles

---

**Remember:** Consistency is key. Always follow this pattern for new features to maintain a clean, maintainable codebase. 🎯

