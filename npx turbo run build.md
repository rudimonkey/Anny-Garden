PS C:\Users\JimRD\Desktop\Anny's Project> npx turbo run build
• turbo 2.9.18
 WARNING  No locally installed `turbo` found in your repository. Using globally installed version (2.9.18), which can cause unexpected behavior.

Installing the version in your repository (latest) before calling `turbo` will result in more predictable behavior across environments.

   • Packages in scope: @plantitas/api, @plantitas/clients, @plantitas/core, @plantitas/db, @plantitas/native, @plantitas/types, @plantitas/ui, @plantitas/web
   • Running build in 8 packages
   • Remote caching disabled

@plantitas/api:build: cache miss, executing 70b15c633438fec3
@plantitas/web:build: cache miss, executing e3308a42a3c89c13
@plantitas/api:build: 
@plantitas/api:build: > @plantitas/api@1.0.0 build C:\Users\JimRD\Desktop\Anny's Project\apps\api
@plantitas/api:build: > tsc
@plantitas/api:build: 
@plantitas/api:build: "tsc" no se reconoce como un comando interno o externo,
@plantitas/api:build: programa o archivo por lotes ejecutable.
@plantitas/api:build:  ELIFECYCLE  Command failed with exit code 1.
@plantitas/api:build:  WARN   Local package.json exists, but node_modules missing, did you mean to install?
@plantitas/web:build: 
@plantitas/web:build: > @plantitas/web@1.0.0 build C:\Users\JimRD\Desktop\Anny's Project\apps\web
@plantitas/web:build: > next build
@plantitas/web:build: 
@plantitas/web:build: "next" no se reconoce como un comando interno o externo,
@plantitas/web:build: programa o archivo por lotes ejecutable.
@plantitas/web:build:  ELIFECYCLE  Command failed with exit code 1.
@plantitas/web:build:  WARN   Local package.json exists, but node_modules missing, did you mean to install?
 ERROR  @plantitas/api#build: command (C:\Users\JimRD\Desktop\Anny's Project\apps\api) C:\Users\JimRD\AppData\Roaming\npm\pnpm.cmd run build exited (1)

 Tasks:    0 successful, 2 total
Cached:    0 cached, 2 total
  Time:    1.911s 
Failed:    @plantitas/api#build

 ERROR  run failed: command  exited (1)
PS C:\Users\JimRD\Desktop\Anny's Project>