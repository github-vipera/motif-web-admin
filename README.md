# MOTIF 2 Web Admin


## Run AOT with ng serve locally ISSUE

During the RUN of the project in AOT with the command "ng serve --prod" you could encounter this crash:

```terminal
<--- Last few GCs --->

526478 ms: Mark-sweep 1326.1 (1407.1) -> 1326.1 (1411.1) MB, 2159.6 / 0.0 ms [allocation failure] [GC in old space requested].
528473 ms: Mark-sweep 1326.1 (1411.1) -> 1326.1 (1419.1) MB, 1995.0 / 0.0 ms [allocation failure] [GC in old space requested].
530656 ms: Mark-sweep 1326.1 (1419.1) -> 1335.8 (1407.1) MB, 2182.1 / 0.0 ms [last resort gc].
532789 ms: Mark-sweep 1335.8 (1407.1) -> 1345.6 (1407.1) MB, 2133.2 / 0.0 ms [last resort gc].
```

To solve check you need to use an alternative local http server with proxy support like this: https://github.com/yunqiangwu/http-server-proxy#readme

Then you need to install it globally (only the first time):

```terminal
 npm install http-server -g
 ```

Then build the project in AOT:

```terminal
ng build --prod
```

 then run the command:

 ```terminal
  http-server ./dist/motif-web-admin/ -P http://motif-server-host/
 ```

Inside the project folder there is a run_aot.sh shell script ready to use. 