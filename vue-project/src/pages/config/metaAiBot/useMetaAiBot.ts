import { ref, computed } from 'vue'
import General from './tabs/General.vue'
import MetaConfig from './tabs/MetaConfig.vue'
import OpenAI from './tabs/OpenAI.vue'
import KnowledgeBase from './tabs/KnowledgeBase.vue'
import Logs from './tabs/Logs.vue'

export function useMetaAiBot() {
    // ===== STATE =====
    const activeTab = ref('general')
    const isLoading = ref(false)
    const hasUnsavedData = ref(false)

    const alertMessage = ref<{
        message: string
        type: "success" | "danger" | "warning" | "info" | ''
    }>({
        message: '',
        type: 'danger'
    })

    const tabs = [
        {
            title: 'General',
            slug: 'general'
        },
        {
            title: 'Meta Config',
            slug: 'metaConfig'
        },
        {
            title: 'OpenAI',
            slug: 'openAI'
        },
        {
            title: 'Knowledge Base',
            slug: 'knowledgeBase'
        },
        {
            title: 'Logs',
            slug: 'logs'
        }
    ]

    const defaultFormData = {
        is_enabled: false,
        webhook_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/wp-json/meta-ai-bot/webhook`,
        verify_token: '',
        bot_name: '',
        default_response: '',
        // Meta Config fields
        meta_app_id: '',
        meta_app_secret: '',
        page_access_token: '',
        business_account_id: '',
        page_id: '',
        events_messages: true,
        events_messaging_postbacks: true,
        events_messaging_optins: false,
        events_messaging_optouts: false,
        // OpenAI Config fields
        openai_api_key: '',
        openai_model: 'gpt-4o',
        openai_temperature: 0.7,
        openai_max_tokens: 2048,
        openai_top_p: 1,
        openai_frequency_penalty: 0,
        openai_presence_penalty: 0,
        openai_organization_id: '',
        // Knowledge Base fields
        kb_system_prompt: '',
        kb_products: [] as any[],
        kb_business_hours: [
            { day: 'Monday', is_open: true, open_time: '09:00', close_time: '17:00' },
            { day: 'Tuesday', is_open: true, open_time: '09:00', close_time: '17:00' },
            { day: 'Wednesday', is_open: true, open_time: '09:00', close_time: '17:00' },
            { day: 'Thursday', is_open: true, open_time: '09:00', close_time: '17:00' },
            { day: 'Friday', is_open: true, open_time: '09:00', close_time: '17:00' },
            { day: 'Saturday', is_open: false, open_time: '10:00', close_time: '14:00' },
            { day: 'Sunday', is_open: false, open_time: '10:00', close_time: '14:00' }
        ],
        kb_faqs: [] as any[]
    }

    const form = ref({ ...defaultFormData })

    const components = {
        general: General,
        metaConfig: MetaConfig,
        openAI: OpenAI,
        knowledgeBase: KnowledgeBase,
        logs: Logs
    }

    // ===== METHODS =====

    const tabChange = (slug: string) => {
        activeTab.value = slug
        form.value = { ...defaultFormData }
    }

    const handleGenerateToken = (btn?: any) => {
        try {
            if (btn) btn.isLoading = true
            form.value.verify_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            alertMessage.value = { message: 'Token generated successfully!', type: 'success' }
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 4000)
        } finally {
            if (btn) btn.isLoading = false
        }
    }

    const handleCopyToClipboard = (text: string, btn?: any) => {
        try {
            if (btn) btn.isLoading = true
            navigator.clipboard.writeText(text)
            alertMessage.value = { message: 'Copied to clipboard!', type: 'success' }
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 4000)
        } catch (error) {
            alertMessage.value = { message: 'Failed to copy to clipboard', type: 'danger' }
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 4000)
        } finally {
            if (btn) btn.isLoading = false
        }
    }

    const handleSaveSettings = async (btn: any, payload: any) => {
        // Validation
        if (payload.bot_name == '' || payload.verify_token == '') {
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
            // TODO: Replace with actual API call
            // const res = await saveMetaAiBotSettings(payload)
            // if (res.status == "success") {
            alertMessage.value.message = 'Settings saved successfully!'
            alertMessage.value.type = 'success'
            hasUnsavedData.value = false
            // }
        } catch ({ response }: any) {
            if (response?.data?.status == "error") {
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

    const handleResetSettings = () => {
        form.value = { ...defaultFormData }
        alertMessage.value = { message: 'Settings reset to defaults', type: 'info' }
        setTimeout(() => {
            alertMessage.value = { message: '', type: '' }
        }, 4000)
    }

    const handleSaveMetaConfig = async (btn: any, payload: any) => {
        // Validation
        if (payload.meta_app_id == '' || payload.page_access_token == '') {
            alertMessage.value.message = `Meta App ID and Page Access Token are required.`
            alertMessage.value.type = 'warning'
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 6000)
            return
        }

        try {
            isLoading.value = true
            btn.isLoading = true
            // TODO: Replace with actual API call
            // const res = await saveMetaAiBotConfig(payload)
            // if (res.status == "success") {
            alertMessage.value.message = 'Meta configuration saved successfully!'
            alertMessage.value.type = 'success'
            hasUnsavedData.value = false
            // }
        } catch ({ response }: any) {
            if (response?.data?.status == "error") {
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

    const handleResetMetaConfig = () => {
        // Reset only Meta Config fields (preserve other tab data)
        form.value.meta_app_id = ''
        form.value.meta_app_secret = ''
        form.value.page_access_token = ''
        form.value.business_account_id = ''
        form.value.page_id = ''
        form.value.events_messages = true
        form.value.events_messaging_postbacks = true
        form.value.events_messaging_optins = false
        form.value.events_messaging_optouts = false
        alertMessage.value = { message: 'Meta configuration reset to defaults', type: 'info' }
        setTimeout(() => {
            alertMessage.value = { message: '', type: '' }
        }, 4000)
    }

    const handleTestConnection = async (btn: any, payload: any) => {
        // Validation
        if (payload.meta_app_id == '' || payload.page_access_token == '') {
            alertMessage.value.message = 'Please fill in App ID and Page Access Token first'
            alertMessage.value.type = 'warning'
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 6000)
            return
        }

        try {
            btn.isLoading = true
            // TODO: Replace with actual API call
            // const res = await testMetaConnection(payload)
            // if (res.status == "success") {
            alertMessage.value.message = 'Connection test successful!'
            alertMessage.value.type = 'success'
            // }
        } catch ({ response }: any) {
            alertMessage.value.message = response?.data?.message || 'Connection test failed'
            alertMessage.value.type = 'danger'
        } finally {
            btn.isLoading = false
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 4000)
        }
    }

    const handleSaveOpenAiConfig = async (btn: any, payload: any) => {
        // Validation
        if (payload.openai_api_key == '' || payload.openai_model == '') {
            alertMessage.value.message = `OpenAI API Key and Model are required.`
            alertMessage.value.type = 'warning'
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 6000)
            return
        }

        try {
            isLoading.value = true
            btn.isLoading = true
            // TODO: Replace with actual API call
            // const res = await saveOpenAiConfig(payload)
            // if (res.status == "success") {
            alertMessage.value.message = 'OpenAI configuration saved successfully!'
            alertMessage.value.type = 'success'
            hasUnsavedData.value = false
            // }
        } catch ({ response }: any) {
            if (response?.data?.status == "error") {
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

    const handleResetOpenAiConfig = () => {
        // Reset only OpenAI Config fields (preserve other tab data)
        form.value.openai_api_key = ''
        form.value.openai_model = 'gpt-4o'
        form.value.openai_temperature = 0.7
        form.value.openai_max_tokens = 2048
        form.value.openai_top_p = 1
        form.value.openai_frequency_penalty = 0
        form.value.openai_presence_penalty = 0
        form.value.openai_organization_id = ''
        alertMessage.value = { message: 'OpenAI configuration reset to defaults', type: 'info' }
        setTimeout(() => {
            alertMessage.value = { message: '', type: '' }
        }, 4000)
    }

    const handleTestOpenAiConnection = async (btn: any, payload: any) => {
        // Validation
        if (payload.openai_api_key == '') {
            alertMessage.value.message = 'Please enter your API key first'
            alertMessage.value.type = 'warning'
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 6000)
            return
        }

        try {
            btn.isLoading = true
            // TODO: Replace with actual API call
            // const res = await testOpenAiConnection(payload)
            // if (res.status == "success") {
            alertMessage.value.message = 'OpenAI connection test successful!'
            alertMessage.value.type = 'success'
            // }
        } catch ({ response }: any) {
            alertMessage.value.message = response?.data?.message || 'OpenAI connection test failed'
            alertMessage.value.type = 'danger'
        } finally {
            btn.isLoading = false
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 4000)
        }
    }

    const handleAddProduct = () => {
        form.value.kb_products.push({
            name: '',
            price: '',
            description: ''
        })
    }

    const handleRemoveProduct = (index: number) => {
        form.value.kb_products.splice(index, 1)
        alertMessage.value = { message: 'Product removed', type: 'info' }
        setTimeout(() => {
            alertMessage.value = { message: '', type: '' }
        }, 2000)
    }

    const handleAddFaq = () => {
        form.value.kb_faqs.push({
            question: '',
            answer: ''
        })
    }

    const handleRemoveFaq = (index: number) => {
        form.value.kb_faqs.splice(index, 1)
        alertMessage.value = { message: 'FAQ removed', type: 'info' }
        setTimeout(() => {
            alertMessage.value = { message: '', type: '' }
        }, 2000)
    }

    const handleSaveKnowledgeBase = async (btn: any, payload: any) => {
        // Validation
        if (payload.kb_system_prompt == '') {
            alertMessage.value.message = 'System Prompt is required.'
            alertMessage.value.type = 'warning'
            setTimeout(() => {
                alertMessage.value = { message: '', type: '' }
            }, 6000)
            return
        }

        try {
            isLoading.value = true
            btn.isLoading = true
            // TODO: Replace with actual API call
            // const res = await saveKnowledgeBase(payload)
            // if (res.status == "success") {
            alertMessage.value.message = 'Knowledge Base saved successfully!'
            alertMessage.value.type = 'success'
            hasUnsavedData.value = false
            // }
        } catch ({ response }: any) {
            if (response?.data?.status == "error") {
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

    const handleResetKnowledgeBase = () => {
        // Reset only Knowledge Base fields (preserve other tab data)
        form.value.kb_system_prompt = ''
        form.value.kb_products = []
        form.value.kb_faqs = []
        form.value.kb_business_hours = [
            { day: 'Monday', is_open: true, open_time: '09:00', close_time: '17:00' },
            { day: 'Tuesday', is_open: true, open_time: '09:00', close_time: '17:00' },
            { day: 'Wednesday', is_open: true, open_time: '09:00', close_time: '17:00' },
            { day: 'Thursday', is_open: true, open_time: '09:00', close_time: '17:00' },
            { day: 'Friday', is_open: true, open_time: '09:00', close_time: '17:00' },
            { day: 'Saturday', is_open: false, open_time: '10:00', close_time: '14:00' },
            { day: 'Sunday', is_open: false, open_time: '10:00', close_time: '14:00' }
        ]
        alertMessage.value = { message: 'Knowledge Base reset to defaults', type: 'info' }
        setTimeout(() => {
            alertMessage.value = { message: '', type: '' }
        }, 4000)
    }

    // ===== RETURN =====
    return {
        activeTab,
        isLoading,
        tabs,
        components,
        tabChange,
        hasUnsavedData,
        form,
        alertMessage,
        handleGenerateToken,
        handleCopyToClipboard,
        handleSaveSettings,
        handleResetSettings,
        handleSaveMetaConfig,
        handleResetMetaConfig,
        handleTestConnection,
        handleSaveOpenAiConfig,
        handleResetOpenAiConfig,
        handleTestOpenAiConnection,
        handleAddProduct,
        handleRemoveProduct,
        handleAddFaq,
        handleRemoveFaq,
        handleSaveKnowledgeBase,
        handleResetKnowledgeBase
    }
}
