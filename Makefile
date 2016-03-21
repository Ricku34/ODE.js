
all: 
	@git.exe archive --output="master.tar" --format=tar --verbose remotes/origin/master
	@tar -xvf master.tar
	@del /F master.tar
	@rmdir /S /Q ode-0.7 src tests
