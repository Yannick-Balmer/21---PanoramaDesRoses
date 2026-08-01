.PHONY: test stop-all start-test start-dev stop-dev generate-compose re-start

BACKEND_DIR=./backend
FRONTEND_DIR=./frontend
DOMAINE ?=

####################################################
# 🛑 1) STOPPER Next.js + NestJS
####################################################
stop-all:
	@echo "🛑 Arrêt des processus Next & Nest..."

	@echo " → Kill port 3000"
	-@lsof -ti :3000 | xargs kill -9 2>/dev/null || true

	@echo " → Kill port 5556"
	-@lsof -ti :5556 | xargs kill -9 2>/dev/null || true

	@echo " → Kill Next.js processes"
	-@pkill -f "next" 2>/dev/null || true
	-@pkill -f "node.*next" 2>/dev/null || true

	@echo " → Suppression du lock Next"
	-@rm -f frontend/.next/dev/lock 2>/dev/null || true

	@echo "✔️ Tous les processus stoppés."

####################################################
# 🧪 2) LANCER Next + Nest en MODE TEST
####################################################
start-test:
	@echo "🧪 Démarrage du backend (Nest) en mode TEST..."
	cd $(BACKEND_DIR) && ENV_FILE=.env.test NODE_ENV=test npm run start &
	sleep 2
	@echo "📦 Build du frontend Next.js..."
	cd $(FRONTEND_DIR) && npm run build
	@echo "🚀 Démarrage du frontend (Next) en mode PROD..."
	cd $(FRONTEND_DIR) && NODE_ENV=production npm run start &
	sleep 3
	@echo "✔️ Environnements TEST lancés."

####################################################
# 🔄 3) LANCER Next + Nest en MODE DEV
####################################################
start-dev: 
	@echo "🔄 Démarrage du backend (Nest) en mode DEV..."
	cd $(BACKEND_DIR) && npm run start:dev &
	sleep 2
	@echo "🔄 Démarrage du frontend (Next) en mode DEV..."
	cd $(FRONTEND_DIR) && npm run dev &
	sleep 2
	@echo "✔️ Environnements DEV lancés."

####################################################
# 🚀 4) WORKFLOW : STOP → TEST → STOP → DEV
####################################################
test:
	@echo "🚀 Workflow complet : STOP → TEST → RUN TESTS → STOP → DEV"
	$(MAKE) stop-all
	$(MAKE) start-test
	@echo "🧪 Execution des tests Playwright..."
	npx playwright test
	$(MAKE) stop-all
	$(MAKE) start-dev
	@echo "🎉 Tests terminés & DEV relancé."

####################################################
# 🛑 STOP DEV (Next + Nest)
####################################################
stop-dev:
	@echo "🛑 Arrêt des environnements DEV..."

	@echo " → Arrêt du backend (port 3000)"
	-@lsof -ti :3000 | xargs kill -9 2>/dev/null || true

	@echo " → Arrêt du frontend (port 5556)"
	-@lsof -ti :5556 | xargs kill -9 2>/dev/null || true

	@echo " → Nettoyage des processus Next"
	-@pkill -f "next dev" 2>/dev/null || true

	@echo " → Nettoyage du lock Next"
	-@rm -f $(FRONTEND_DIR)/.next/dev/lock 2>/dev/null || true

	@echo "✔️ Environnements DEV arrêtés."

####################################################
# RE-START
####################################################
re-start:

	$(MAKE) stop-dev
	sleep 2
	$(MAKE) start-dev


####################################################
# 🐳 GÉNÉRATION D'UN DOCKER-COMPOSE
####################################################
generate-compose:
	@if [ -z "$(DOMAINE)" ]; then \
		echo "❌ Utilisation : make generate-compose APP_NAME=mon-app"; \
		exit 1; \
	fi

	@echo "🛠 Génération du docker-compose pour '$(DOMAINE)'..."

	@sed 's/{{APP-NAME}}/$(DOMAINE)/g' \
		docker-compose.prod.template.yaml \
		> docker-compose.prod.$(DOMAINE).yaml

	@echo "✅ Fichier généré : docker-compose.prod.$(DOMAINE).yaml"
