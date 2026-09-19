# **Bit N Build'26 Gujarat Round Problem Statements**

# **PS-1 \- Hobby Matchmaker for Aatmoday**

## **1\. Introduction**

Students often have interests and hobbies but may not know which Aatmoday sub-group, hobby community, or event would be the right fit.

This can be particularly challenging for new students who want to discover communities and start conversations.

## **2\. Problem Description**

Build a platform where a student can simply describe their interests and receive relevant Aatmoday group or event recommendations.

The system should not only recommend communities but also explain **why** each recommendation is relevant and help the student initiate a conversation.

## **3\. Expected Deliverables**

* Free-form interest input.  
* Aatmoday group and event database.  
* AI-powered interest understanding.  
* Interest-to-group/event matching.  
* Relevant recommendations.  
* Explanation for each recommendation.  
* Personalized icebreaker generation.  
* Support for different types of student interests.


## 

## **4\. Suggested Technology Stack (You can go with your feasible tech stack)**

**Frontend:** React / Next.js / HTML / CSS / JavaScript / Tailwind CSS  
**Backend:** Node.js / Python / Java / PHP  
**Database:** MongoDB / PostgreSQL / MySQL / SQLite / Firebase / JSON  
**Additional:** Search, recommendation systems, authentication, notifications, analytics

# 

# 

# 

# 

# 

# 

# 

# 

# 

# **PS-2 \- AI-Powered GeoSpatial Site Readiness Analyzer**

## **1\. Introduction**

Selecting an optimal location for a retail store, warehouse, EV charging station, telecom tower, or renewable-energy installation requires analysis of numerous geographical factors.

These may include population density, road accessibility, competitor proximity, land use, environmental risks, and utility infrastructure.

## **2\. Problem Description**

Currently, such analysis is often performed manually using disconnected GIS tools, spreadsheets, and analyst judgment. This can result in lengthy evaluation cycles and inconsistent site-selection decisions.

Build an **AI-powered GeoSpatial Site Readiness Analyzer** that:

1. Ingests multiple geospatial data layers.  
2. Computes a composite readiness score.  
3. Performs spatial analysis.  
4. Provides interactive map-based visualization.  
5. Explains the factors contributing to each site's score.

## **3\. Expected Deliverables**

### **3.1 Multi-Layer Geospatial Data Ingestion**

The system should support at least five distinct geospatial data layers.

Supported formats may include:

* GeoJSON  
* Shapefiles  
* GeoTIFF  
* WKT

Potential data layers include:

* **Demographics:** Population density, income, age distribution.  
* **Transportation:** Road density, highways, transit, drive-time isochrones.  
* **Points of Interest:** Competitors, complementary businesses, anchor tenants.  
* **Land Use & Zoning:** Commercial, residential, industrial zones, building footprints.  
* **Environmental & Risk:** Flood zones, earthquake risk, air quality.

### **3.2 Site Readiness Scoring**

Build a configurable scoring model that produces a **Site Readiness Score from 0–100**.

The model should support:

* Configurable weights.  
* Distance-decay functions.  
* Competitive-density analysis.  
* Threshold-based constraints.

### **3.3 Spatial Clustering & Hot-Spot Detection**

Implement spatial analysis algorithms such as:

* DBSCAN  
* Getis-Ord Gi\*  
* H3 hexagonal binning

The system should identify and visualize:

* High-potential areas.  
* Underserved areas.  
* Hot-spots.  
* Cold-spots.

### **3.4 Interactive Map Interface**

Users should be able to:

* Select any location and view its readiness score.  
* Inspect the scoring breakdown.  
* Toggle data layers.  
* Adjust layer opacity.  
* Draw custom search polygons.  
* Compare candidate sites.  
* Export reports.

Suggested mapping technologies include Mapbox GL, Leaflet, Deck.gl, and Kepler.gl.

### **3.5 Route & Accessibility Analysis**

Integrate routing APIs such as:

* OSRM  
* Valhalla  
* Google Maps

The system should calculate:

* Drive-time isochrones.  
* Walk-time isochrones.  
* Catchment areas.  
* Population reachable within 10, 20, and 30 minutes.

## **4\. Suggested Datasets**

* OpenStreetMap data extracts.  
* Census demographic data.  
* FEMA flood-zone boundaries.  
* EPA air-quality data.  
* Synthetic competitor-location datasets.

**Note:** Spatial data should cover a single defined metropolitan area for consistency.

## **5\. Suggested Technology Stack (You can go with your feasible tech stack)**

**Backend:** Python, FastAPI, GeoPandas, Shapely, H3, Scikit-learn  
**Database:** PostgreSQL \+ PostGIS  
**Frontend:** React \+ MapLibre GL / Mapbox GL JS / Deck.gl  
**Tiling:** Tippecanoe or equivalent vector-tile tools

# 

# **PS-3 \- ClubOps AI**

## **1\. Introduction**

College clubs often manage events using a combination of WhatsApp groups, spreadsheets, documents, meeting notes, and personal task lists.

As an event becomes larger, managing responsibilities, deadlines, dependencies, volunteers, documents, and potential risks becomes increasingly difficult.

## **2\. Problem Description**

Build a centralized **AI-powered event operations platform** that brings all important club activities into one place.

The platform should help clubs plan and execute events by managing:

* Tasks  
* Volunteers  
* Meetings  
* Deadlines  
* Documents  
* Risks  
* Announcements  
* Event-related knowledge

The AI layer should assist the club throughout the event lifecycle and, where possible, perform actual application actions rather than simply generating text.

## **3\. Expected Deliverables**

* AI-assisted event planning.  
* Task and volunteer management.  
* Meeting-note or transcript processing.  
* Automatic extraction of action items.  
* Automatic identification of task owners and deadlines.  
* Risk identification and explanation.  
* Club document and knowledge repository.  
* AI-assisted announcements and communication.  
* AI-assisted workflows capable of performing application actions.

## **4\. Suggested Technology Stack (You can go with your feasible tech stack)**

**AI Models:** Gemini, ChatGPT, Claude, Llama, Mistral, etc.  
**AI APIs:** Gemini API, OpenAI API, and other suitable APIs  
**Frontend:** React / Next.js / HTML / CSS / JavaScript / Tailwind CSS  
**Backend:** Node.js / Python / Java / PHP  
**Database:** MongoDB / PostgreSQL / MySQL / SQLite / Firebase / JSON  
**Additional:** RAG, document processing, authentication, notifications, dashboards

# 

# 

# 

# 

# 

# 

# 

# **PS-4 \- Cross-Channel Journey Stitching**

## **1\. Introduction**

Customer interactions are often distributed across multiple channels such as mobile applications, websites, call centers, and physical locations.When these interactions remain siloed, organizations struggle to understand the complete customer journey and identify the exact points where customers experience problems.

## **2\. Problem Description**

Build a **cross-channel identity resolution and event-stitching platform** that creates a unified customer journey by combining interactions from different channels.

The platform should allow organizations to understand:

* Where customers drop off.  
* Where escalations occur.  
* Which issues remain unresolved.  
* Which experiences correlate with churn.  
* Where customers repeatedly contact support.

## **3\. Expected Deliverables**

* Design an identity-resolution algorithm.  
* Link customer interactions across multiple channels.  
* Build a data pipeline for event ingestion.  
* Normalize and stitch events into a unified customer timeline.  
* Develop an analyst-facing journey visualization interface.  
* Highlight drop-off points and escalations.  
* Identify patterns associated with churn and repeat contacts.  
* Optimize identity-resolution accuracy and data latency.

## **4\. Suggested Technology Stack(You can go with your feasible tech stack)**

**Frontend:** React / Next.js  
**Backend:** Node.js / Python / Java  
**Data Processing:** Python / Kafka / event-processing pipelines  
**Database:** PostgreSQL / MongoDB  
**Analytics:** Python / Scikit-learn  
**Visualization:** Recharts / D3.js / similar visualization libraries

## **5\. Expected Outcome**

A unified customer journey platform that provides actionable visibility into customer interactions across app, web, call-center, and in-person channels.

# **PS-5 \- Smart Anchor & Stage Flow Management System**

## **1\. Introduction**

College events such as hackathons, workshops, seminars, competitions, and cultural programs involve multiple speakers, activities, and strict schedules.

During live execution, anchors and organizers must simultaneously manage introductions, transitions, timings, audience engagement, schedule changes, and unexpected announcements.

## **2\. Problem Description**

Build a **real-time event management platform** that assists organizers during both event preparation and live execution.

The platform should provide anchors with relevant context, dynamically generated scripts, and quick assistance whenever the event schedule changes.

## **3\. Expected Deliverables**

* Event and agenda management.  
* Speaker and guest management.  
* AI-generated opening scripts.  
* AI-generated speaker introductions.  
* AI-generated transition scripts.  
* AI-generated closing scripts.  
* Live dashboard showing current and upcoming activities.  
* Dynamic agenda updates.  
* Support for delays and unexpected announcements.  
* At least one meaningful AI-powered application workflow.

## 

## 

## 

## **4\. Suggested Technology Stack(You can go with your feasible tech stack)**

**Frontend:** React / Next.js / HTML / CSS / JavaScript / Tailwind CSS / Bootstrap  
**Backend:** Node.js / Python / Java / PHP  
**Database:** MongoDB / PostgreSQL / MySQL / SQLite / Firebase / JSON  
**Additional:** WebSockets, voice/live APIs, authentication, notifications, data visualization

# 

# 

# **PS-6 \- Autonomous Farm-to-Field Advisory & Action Orchestration Agents**

## **1\. Introduction**

Small and mid-scale farmers, particularly in rural and connectivity-limited regions, often face fragmented decision-making across irrigation, nutrients, pest and disease control, and market timing.

Advice may be generic, delayed, or insufficiently localized to the farm's micro-climate, soil conditions, and crop stage.

## **2\. Problem Description**

Farming workflows frequently remain reactive and manual despite the availability of IoT devices and remote-sensing technologies.

Important information may be distributed across:

* Soil sensors.  
* Weather feeds.  
* Drone imagery.  
* Market-price data.

Build a **multi-agent AI system** capable of continuously monitoring these signals, identifying risks, generating action plans, and coordinating execution.

## **3\. Expected Deliverables**

The system should autonomously:

### **Detect Risks**

Identify potential:

* Water stress.  
* Pest or disease risk.  
* Nutrient deficiencies.

### 

### **Generate Action Plans**

Recommend:

* What action should be taken.  
* When it should be taken.  
* Where it should be performed.

The plan should consider constraints such as:

* Cost.  
* Safety.  
* Weather windows.

### **Coordinate Execution**

The system should be capable of:

* Triggering tasks.  
* Sending alerts.  
* Tracking task completion.  
* Escalating cases to experts when required.

## **4\. Suggested Technology Stack(You can go with your feasible tech stack)**

**AI:** Multi-agent LLM architecture  
**Backend:** Python / FastAPI  
**Data Processing:** Python / Pandas  
**Sensors & IoT:** MQTT / REST APIs  
**Database:** PostgreSQL / MongoDB  
**Frontend:** React / Next.js  
**Additional:** Weather APIs, remote-sensing data, notification systems

# 

# 

# 

# **PS-7 \- Card Benefit Activation Engine**

## **1\. Introduction**

Many card members are unaware of, or forget to claim, insurance and protection benefits included with their cards.

These may include benefits such as:

* Purchase protection.  
* Return protection.  
* Travel-delay insurance.

## **2\. Problem Description**

Build a **Card Benefit Activation Engine** that automatically identifies when a transaction qualifies for a card protection benefit and assists the customer in activating that benefit.

The solution should focus specifically on **insurance and protection benefits**, rather than loyalty or rewards programs.

The system should reduce the effort required to activate benefits that the card member is already entitled to.

## **3\. Expected Deliverables**

* Monitor transactions in real time.  
* Detect purchases that qualify for card protections.  
* Match purchases to the appropriate benefit type.  
* Build a customer-facing interface.  
* Automatically pre-fill claim information.  
* Integrate entitlement, claim-submission, and approval workflows.  
* Optimize detection accuracy.  
* Improve claim pre-fill quality.  
* Reduce the number of unclaimed benefits.

## 

## 

## **4\. Suggested Technology Stack(You can go with your feasible tech stack)**

**Frontend:** React / Vue.js  
**Backend & APIs:** Node.js / Spring Boot  
**Transaction Processing:** Python / Kafka  
**Rules & ML:** Scikit-learn / TensorFlow  
**Cloud:** AWS / GCP  
**Database:** MySQL / DynamoDB

**Technology is open to alternatives; the listed technologies are examples rather than mandatory requirements.**

## **5\. Reference Resources**

* Google Pub/Sub Documentation  
* Stripe Issuing API  
* AWS Lambda Documentation

# 

# **PS-8 \- Autonomous Travel-Disruption Concierge**

## **1\. Introduction**

Flight cancellations and missed connections can create significant stress for travelers and often require card members to manually manage rebooking, hotel changes, and travel notifications.

This challenge focuses on building an **intelligent, autonomous travel concierge** that can detect disruptions in real time and take appropriate actions on behalf of the traveler.

## **2\. Problem Description**

Traditional itinerary planners primarily provide information to travelers. They do not actively respond when a disruption occurs.

The proposed solution should go beyond passive notifications by detecting a disruption as soon as it happens and autonomously managing the required travel changes.

The system should be capable of:

* Detecting flight cancellations and missed connections.  
* Finding suitable alternative flights.  
* Rebooking flights within applicable policy limits.  
* Rearranging hotel stays when necessary.  
* Notifying the card member about changes and confirmations.

## **3\. Expected Deliverables**

* Design an algorithm to monitor live flight data and detect disruptions.  
* Implement autonomous flight rebooking logic.  
* Evaluate alternative flights based on applicable policies and constraints.  
* Handle related hotel changes.  
* Develop a card-member-facing interface.  
* Integrate airline, hotel, and notification APIs.  
* Provide real-time alerts and confirmation updates.  
* Test and optimize the system for detection speed and rebooking success.

## **4\. Suggested Technology Stack(You can go with your feasible tech stack)**

**AI / Agent Layer:** LLM-based agents, decision engines  
**Backend:** Python / Node.js / Java  
**Frontend:** React / Next.js  
**Database:** PostgreSQL / MongoDB  
**APIs:** Airline, hotel, travel, and notification APIs  
**Real-Time:** WebSockets / event-driven architecture

## **5\. Expected Outcome**

A proactive travel concierge capable of responding to live travel disruptions with minimal or no manual intervention.

# **PS-9 \- Intelligent Emergency Response & Resource Coordination Platform**

## **1\. Introduction**

During large-scale emergencies such as floods, fires, industrial accidents, and major road incidents, information arrives from many disconnected sources.

These sources may include:

* Emergency calls.  
* Citizen reports.  
* Sensors.  
* Field teams.  
* Hospitals.  
* Government departments.

The fragmented nature of this information can make it difficult for authorities to understand the evolving situation and coordinate appropriate resources quickly.

## **2\. Problem Description**

Build an **Intelligent Emergency Response & Resource Coordination Platform** that continuously collects incident information, identifies emergency severity and location, recommends appropriate response resources, and coordinates response teams in real time.

## **3\. Expected Deliverables**

### **Incident Collection**

Collect emergency incidents from multiple sources such as citizen reports, sensors, emergency calls, and field teams.

### **Incident Classification**

Develop an AI-powered system to:

* Classify incidents.  
* Estimate severity.  
* Assign priority levels.

### **Duplicate Detection**

Identify duplicate or related reports and consolidate them into a single incident.

### **Resource Recommendation**

Recommend suitable:

* Emergency teams.  
* Vehicles.  
* Equipment.  
* Facilities.

### **Real-Time Monitoring**

Build a dashboard displaying:

* Active emergencies.  
* Severity.  
* Assigned teams.  
* Response status.

### **Alerts & Escalation**

Provide alerts for:

* Critical incidents.  
* Delayed responses.  
* Cases requiring escalation.

### **AI Assistance**

Provide AI-generated emergency summaries and useful recommendations for response teams.

### **Analytics**

Analyze:

* Emergency types.  
* Response delays.  
* Resource shortages.  
* Frequently affected areas.

### 

### **Notifications**

Provide timely updates to emergency personnel and relevant authorities.

## **4\. Suggested Data Sources**

Teams may use:

* Synthetic emergency incident data.  
* OpenStreetMap road and infrastructure data.  
* Public hospital datasets.  
* Synthetic emergency-team/resource availability data.  
* Historical disaster datasets.  
* Weather and disaster datasets.  
* Simulated sensor feeds.

## **5\. Suggested Technology Stack(You can go with your feasible tech stack)**

**AI / ML:** Python, Scikit-learn, LLM APIs  
**Backend:** FastAPI / Node.js / Java  
**Frontend:** React / Next.js  
**Database:** PostgreSQL / MongoDB  
**Maps:** OpenStreetMap / MapLibre / Leaflet  
**Real-Time:** WebSockets / event-driven architecture  
**Notifications:** SMS / email / push notification APIs

# **PS-10 \- CloudOps: Unified Cloud Resource, Scaling & Cost Management Platform**

## **1\. Introduction**

Modern applications are deployed across cloud platforms such as AWS, Microsoft Azure, and Google Cloud.

Managing these environments often requires specialized DevOps and cloud expertise. Even routine tasks such as increasing capacity, allocating resources, monitoring performance, and analyzing cloud costs may require interaction with complex cloud consoles or infrastructure tools.

## **2\. Problem Description**

Build a **unified cloud management platform** that provides authorized users with a simple interface for monitoring and managing cloud infrastructure.

The platform should bring together:

* Infrastructure metrics.  
* Application performance.  
* Resource management.  
* Scaling operations.  
* Cloud costs.  
* Billing information.  
* Policy and permission controls.

## **3\. Expected Deliverables**

The platform should allow authorized users to:

* Monitor application and infrastructure metrics.  
* Monitor traffic.  
* Monitor latency.  
* Monitor storage.  
* Monitor uptime.  
* Monitor service health.  
* Manage service resources.  
* Scale applications according to demand.  
* Analyze infrastructure costs.  
* Understand the financial impact of infrastructure decisions.

##  **Intelligent Recommendations**

The platform should provide intelligent recommendations for:

* Resource allocation.  
* Application scaling.  
* Cost optimization.

Recommendations should respect configurable:

* Policies.  
* Budgets.  
* Permissions.  
* Safety limits.

### **Example Workflow**

When traffic increases significantly, the platform could:

1. Detect the increase.  
2. Recommend increasing service capacity.  
3. Display the estimated cost impact.  
4. Allow the authorized user to review the change.  
5. Apply the change after authorization.

##  **Objective**

The primary objective is to reduce routine DevOps overhead and make cloud infrastructure management more accessible to developers, product teams, and authorized non-technical users.

The platform should simplify infrastructure management without exposing users directly to the complexity of the underlying cloud infrastructure.

## **Advanced Scope \- Multi-Cloud Control Plane**

As an advanced extension, the platform can support multiple cloud providers through a common abstraction layer.

Potential providers include:

* AWS  
* Microsoft Azure  
* Google Cloud  
* Other infrastructure providers

A multi-cloud control plane could provide unified monitoring of:

* Cloud resources.  
* Performance.  
* Costs.  
* Scaling operations.

## **4\. Suggested Technology Stack(You can go with your feasible tech stack)**

**Cloud Providers:** AWS / Microsoft Azure / Google Cloud  
**Backend:** Python / Node.js / Java  
**Frontend:** React / Next.js  
**Database:** PostgreSQL / MongoDB  
**Infrastructure APIs:** Cloud provider SDKs  
**Monitoring:** Prometheus / cloud-native monitoring APIs  
**Infrastructure:** Terraform / provider SDKs  
**Real-Time:** WebSockets / event-driven architecture

# 

# **PS-11 \- AI-Powered Waste Management & Recycling Optimizer**

## **1\. Introduction**

Cities, campuses, and large residential communities generate significant amounts of waste every day.

However, waste collection is often based on fixed schedules and routes without considering real-time bin fill levels, waste type, traffic conditions, or collection capacity.

## **2\. Problem Description**

Inefficient collection practices can lead to:

* Overflowing bins.  
* Unnecessary collection trips.  
* Higher operational costs.  
* Poor recycling efficiency.

Build an **AI-Powered Waste Management & Recycling Optimizer** that monitors waste generation, predicts bin fill levels, classifies waste, and intelligently plans collection and recycling operations.

## **3\. Expected Deliverables**

### **Bin Monitoring**

Collect and monitor:

* Bin location.  
* Bin capacity.  
* Current fill level.  
* Waste type.

### **Fill-Level Prediction**

Develop an AI model that predicts when individual bins are likely to become full using historical waste-generation patterns.

### 

### **Waste Classification**

Implement image-based waste classification for categories such as:

* Plastic.  
* Paper.  
* Metal.  
* Glass.  
* Organic.  
* Other waste.

### **Collection Prioritization**

Prioritize bins based on:

* Current fill level.  
* Predicted overflow time.  
* Location.  
* Waste type.

### **Route Optimization**

Generate efficient vehicle routes while considering:

* Vehicle capacity.  
* Collection requirements.  
* Operational constraints.

### **Dashboard**

Provide visualization of:

* Bin status.  
* Collection priorities.  
* Vehicle locations.  
* Collection routes.  
* Waste statistics.

### **Alerts**

Generate alerts for:

* Bins approaching overflow.  
* Areas with unusually high waste generation.

### **Analytics**

Identify waste-generation patterns and recommend improvements to:

* Collection schedules.  
* Recycling operations.

### **Waste Estimation**

Estimate recyclable and non-recyclable waste collected over time.

## **4\. Suggested Technology Stack(You can go with your feasible tech stack)**

**AI / ML:** Python / Scikit-learn / TensorFlow / computer-vision models  
**Backend:** Python / FastAPI / Node.js  
**Frontend:** React / Next.js  
**Database:** PostgreSQL / MongoDB  
**Maps:** OpenStreetMap / MapLibre / Leaflet  
**Optimization:** OR-Tools or equivalent optimization algorithms  
**IoT:** MQTT / REST APIs

