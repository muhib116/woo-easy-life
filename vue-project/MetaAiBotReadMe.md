Meta AI Bot for WordPress

A SaaS-ready, AI-driven automation tool that connects Facebook Messenger to your WordPress site using OpenAI's GPT models. This plugin allows businesses to automate customer support and sales with a bot that understands context, identifies individual users, and handles multiple products gracefully.

🚀 Key Features

AI-Driven Conversations: Uses OpenAI GPT-4o to understand customer intent beyond simple keywords.

Context Awareness: Remembers previous interactions using OpenAI Threads mapped to unique Facebook PSIDs.

Multi-Product Handling: Intelligent logic to identify which product a customer is interested in based on conversation history.

Vue 3 Admin Dashboard: A modern, reactive interface built with Vue 3 and Tailwind CSS for easy configuration.

SaaS-Ready Architecture: Designed for easy distribution; users simply plug in their own API keys and tokens.

Discreet Privacy Focus: Optimized for personal care brands with pre-built logic for privacy-sensitive products.

🛠️ Technical Stack

Backend: PHP (WordPress Plugin API)

Frontend: Vue 3 (Composition API) & Tailwind CSS

Database: MySQL (via WordPress wpdb)

Integration: Meta Graph API & OpenAI Assistants API

📋 Installation & Setup

1. Plugin Installation

Download the plugin as a .zip file.

Go to your WordPress Admin Dashboard > Plugins > Add New.

Upload and Activate the plugin.

2. Meta (Facebook) Configuration

Log in to the Meta for Developers portal.

Create a new App and select the Messenger product.

In the plugin settings under General, copy the Webhook URL.

Paste the URL into the Meta "Webhooks" configuration and use the Verify Token you set in the plugin settings.

Generate a Page Access Token and paste it into the Meta Config tab of the plugin.

3. OpenAI Configuration

Go to the OpenAI Platform.

Generate a new API Secret Key.

Paste the key into the OpenAI API tab of the plugin.

Select your preferred model (GPT-4o recommended).

4. Knowledge Base Setup

Navigate to the Knowledge Base tab.

In the System Prompt field, describe your products, pricing, and shipping rules in detail.

Save Settings.

📁 Folder Structure

meta-ai-bot-plugin/
├── meta-ai-bot.php          # Entry point
├── includes/
│   ├── admin-settings.php   # Vue 3 Dashboard logic
│   ├── webhook-handler.php  # Meta Webhook listener
│   ├── openai-api.php       # OpenAI Threading & Runs
│   ├── database.php         # DB Table creation (psid <-> thread_id)
│   └── messenger-api.php    # Sending replies to Meta
└── assets/
    ├── style.css            # Dashboard styling
    └── script.js            # Vue 3 logic


🔒 Security

All API keys are stored securely using the WordPress Options API.

Webhook verification ensures only Meta can trigger the bot logic.

Admin pages are protected with standard WordPress capability checks.

📄 License

This project is licensed under the MIT License.