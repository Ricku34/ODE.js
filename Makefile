
all: 
	@git archive --output="master.tar" --format=tar --verbose remotes/origin/master
	@tar -xvf master.tar
	@rm -f master.tar
	@mv README.md index.md
	@npm install
	@grunt doc

clear:
	@rm -rf ode-0.7 src tests .gitignore .npmignore .jsdoc.json
