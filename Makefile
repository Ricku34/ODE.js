
all: 
	@git archive --output="master.tar" --format=tar --verbose remotes/origin/master
	@tar -xvf master.tar
	@rm -f master.tar
	@npm install
	@grunt doc
	@grunt clear
	@rm -rf ode-0.7 src tests
