RM=rm -f
CC=gcc -D_GNU_SOURCE
LOCALLIB=-I/usr/local/include -L/usr/local/lib
STAGING_DEBUG=1

SPIDERMONKEYMOD=libmod_spidermonkey.so
SPIDERMONKEYSRC=libape-spidermonkey.c
HEADERS=global_plugins.h plugins.h ../src/configure.h
FLAGS=-I../deps/js/src/dist/include/ -L../deps/js/src/ -ljs_static -lstdc++

include ../build.mk
ifdef STAGING_DEBUG
DEBUGFLAGS=-g -ggdb -finstrument-functions
PROFILEFLAGS=-pg -profile
# -fdump-rtl-expand
endif
all: modules

include ./mysql.mk
ifeq ($(HAS_MYSQL), yes)
MYSQL_DEP_DIR=deps/mysac
MYSQL_DEP=$(MYSQL_DEP_DIR)/libmysac.a
MYSQL_FLAGS=-L./$(MYSQL_DEP_DIR)/ -I./$(MYSQL_DEP_DIR)/ -lmysac -lmysqlclient_r
$(MYSQL_DEP):
	@cd $(MYSQL_DEP_DIR)&&touch make.deps&&make&&cd ../..
endif

include ./mongo.mk
ifeq ($(HAS_MONGO), yes)
MONGO_DEP_DIR=deps/mongo-c-driver-master
MONGO_DEP_SRC=$(MONGO_DEP_DIR)/src
MONGO_DEP=$(MONGO_DEP_DIR)/libbson.so $(MONGO_DEP_DIR)/libmongoc.so  
MONGO_DEFINES=-DMONGO_BIG_ENDIAN -DMONGO_HAVE_STDINT 
# -DMONGO_HAVE_STDBOOL MONGO_HAVE_UNISTD -DMONGO_USE__INT64 -DMONGO_USE_LONG_LONG_INT
MONGO_FLAGS=-static -L./$(MONGO_DEP_DIR)/ $(LOCALLIB) -I./$(MONGO_DEP_SRC)/ $(MONGO_DEFINES) -lbson -lmongoc -lmongoclient
$(MONGO_DEP):
	@cd $(MONGO_DEP_DIR)&&make&&cd ../..
endif


include ./platform.mk
ifdef DARWIN_BUILD
CFLAGS=-Wall -O2 -minline-all-stringops
CLFLAGS=-bundle -undefined suppress -flat_namespace
endif

ifdef LINUX_BUILD
CFLAGS=-Wall -g -minline-all-stringops -shared -fPIC -rdynamic
CLFLAGS=-Wl,-soname,$(SPIDERMONKEYMOD) $(LOCALLIB)
endif

modules: lib/$(SPIDERMONKEYMOD)

lib/$(SPIDERMONKEYMOD): $(SPIDERMONKEYSRC) ../deps/js/src/libjs_static.a $(HEADERS) $(MYSQL_DEP) $(MONGO_DEP)
	@$(CC) $(CFLAGS) $(CLFLAGS) $(DEBUGFLAGS) $(PROFILEFLAGS) -o lib/$(SPIDERMONKEYMOD) $< $(FLAGS) $(MYSQL_FLAGS) $(MONGO_FLAGS)
	@chmod 755 lib/$(SPIDERMONKEYMOD)
ifdef STAGING_RELEASE
	@strip lib/$(SPIDERMONKEYMOD)
endif
	@echo done

../deps/js/src/libjs_static.a:
	@cd ../deps/js/src/&&./configure&&make -j8&&cd ../../../modules

.PHONY: clean

clean:
	@$(RM) lib/$(SPIDERMONKEYMOD)
