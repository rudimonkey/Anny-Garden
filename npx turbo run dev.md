PS C:\Users\JimRD\Desktop\Anny's Project> npx turbo run dev
• turbo 2.9.18
 WARNING  No locally installed `turbo` found in your repository. Using globally installed version (2.9.18), which can cause unexpected behavior.

Installing the version in your repository (latest) before calling `turbo` will result in more predictable behavior across environments.

   • Packages in scope: @plantitas/api, @plantitas/clients, @plantitas/core, @plantitas/db, @plantitas/native, @plantitas/types, @plantitas/ui, @plantitas/web
   • Running dev in 8 packages
   • Remote caching disabled

@plantitas/api:dev: cache bypass, force executing 9e20f3992f2ec110
@plantitas/web:dev: cache bypass, force executing 4c0558dc421f8285
@plantitas/api:dev: 
@plantitas/api:dev: > @plantitas/api@1.0.0 dev C:\Users\JimRD\Desktop\Anny's Project\apps\api
@plantitas/api:dev: > ts-node-dev index.ts
@plantitas/api:dev: 
@plantitas/api:dev: "ts-node-dev" no se reconoce como un comando interno o externo,
@plantitas/api:dev: programa o archivo por lotes ejecutable.
@plantitas/web:dev: 
@plantitas/web:dev: > @plantitas/web@1.0.0 dev C:\Users\JimRD\Desktop\Anny's Project\apps\web
@plantitas/web:dev: > next dev
@plantitas/web:dev: 
@plantitas/api:dev:  ELIFECYCLE  Command failed with exit code 1.
@plantitas/api:dev:  WARN   Local package.json exists, but node_modules missing, did you mean to install?
@plantitas/web:dev: "next" no se reconoce como un comando interno o externo,
@plantitas/web:dev: programa o archivo por lotes ejecutable.
@plantitas/web:dev:  ELIFECYCLE  Command failed with exit code 1.
@plantitas/web:dev:  WARN   Local package.json exists, but node_modules missing, did you mean to install?
 ERROR  @plantitas/api#dev: command (C:\Users\JimRD\Desktop\Anny's Project\apps\api) C:\Users\JimRD\AppData\Roaming\npm\pnpm.cmd run dev exited (1)

 Tasks:    0 successful, 2 total
Cached:    0 cached, 2 total
  Time:    1.676s 
Failed:    @plantitas/api#dev

 ERROR  run failed: command  exited (1)
PS C:\Users\JimRD\Desktop\Anny's Project> 