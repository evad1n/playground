# https://github.com/amjadmajid/Makefile

VAR1 := hello
VAR2 = goodbye

LS_OUT = $(shell ls)

all: 1
	@echo $@ & @echo $(MAKE)
	@echo ok

1:
	@echo $@

hello:
	@echo $(VAR1)

goodbye1:
	@echo $(VAR2)

goodbye2:
	VAR2 = hey
	@echo $(VAR2)

# -C $$dir/path $@