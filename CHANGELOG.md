### v2.0.16 (2021-03-26)

#### 🏡 Internal

* [#53](https://github.com/groupon/selenium-download/pull/53) chore: switch to main & update packages ([@aaarichter](https://github.com/aaarichter)) 


### 2.0.15

* fix download Key error - **[@dbushong](https://github.com/dbushong)** [#52](https://github.com/groupon/selenium-download/pull/52)
  - [`4783124`](https://github.com/groupon/selenium-download/commit/478312418ea2983f66bd57e518cf9c7d539da114) **chore:** npm audit fix --force
  - [`5a61e29`](https://github.com/groupon/selenium-download/commit/5a61e29a1e2790a7f6c8f7595e508ba76638505f) **style:** eslint --fix
  - [`8b850a6`](https://github.com/groupon/selenium-download/commit/8b850a62aca7c559824a4a3018860d14f08e51dc) **fix:** only download latest version with server
  - [`b70dce7`](https://github.com/groupon/selenium-download/commit/b70dce73fd62c0ef11813156b3c6f345441c7f55) **chore:** try openjdk for java test


### 2.0.14

* Do not download alpha versions - **[@jkrems](https://github.com/jkrems)** [#50](https://github.com/groupon/selenium-download/pull/50)
  - [`d4edd83`](https://github.com/groupon/selenium-download/commit/d4edd834f99a74e5c088d080fe3440472091f93d) **fix:** Do not download alpha versions
  - [`447e3dd`](https://github.com/groupon/selenium-download/commit/447e3dde737f55cb32f8ef0055d12d87a25fbed9) **chore:** Fix travis setup


### 2.0.13

* Add extension for windows - **[@jkrems](https://github.com/jkrems)** [#46](https://github.com/groupon/selenium-download/pull/46)
  - [`266232d`](https://github.com/groupon/selenium-download/commit/266232dd50550e3109a274d53e30684c0bdf3a4f) **style:** Run eslint --fix
  - [`e1e1623`](https://github.com/groupon/selenium-download/commit/e1e16233dd441d87bd3f9ac682708a558bac2905) **fix:** add extension for windows - see: [#41](https://github.com/groupon/selenium-download/issues/41)


### 2.0.12

* Stop using magical offsets to determine latest selenium - **[@jkrems](https://github.com/jkrems)** [#43](https://github.com/groupon/selenium-download/pull/43)
  - [`21dbde7`](https://github.com/groupon/selenium-download/commit/21dbde72103e134f7f8fefbdaddabbc1f08c0f9c) **fix:** Stop using magical offsets to determine latest selenium - see: [#40](https://github.com/groupon/selenium-download/issues/40), [39](https://github.com/groupon/selenium-download/pull/39)


### 2.0.11

* Apply latest nlm generator - **[@markowsiak](https://github.com/markowsiak)** [#42](https://github.com/groupon/selenium-download/pull/42)
  - [`2b7315d`](https://github.com/groupon/selenium-download/commit/2b7315dfe9187270352599bb5e3ae87b8223ff12) **chore:** Apply latest nlm generator


### 2.0.10

* fix: The XML source from where we were getting the version changed - **[@jac1013](https://github.com/jac1013)** [#38](https://github.com/groupon/selenium-download/pull/38)
  - [`e68e819`](https://github.com/groupon/selenium-download/commit/e68e819250bb235a0c64223e2c4bab886b1de732) **fix:** The XML source from where we were getting the version changed
  - [`2716011`](https://github.com/groupon/selenium-download/commit/2716011c33eb564ed17806daae8876006dbc164c) **fix:** trying to add a greater java version through .travis.yml to make tests in CI pass.


### 2.0.9

* Only delete files we created - **[@jkrems](https://github.com/jkrems)** [#36](https://github.com/groupon/selenium-download/pull/36)
  - [`b720fad`](https://github.com/groupon/selenium-download/commit/b720fad52bf759939465d94b91082398e142601d) **fix:** Only delete files we created - see: [#22](https://github.com/groupon/selenium-download/issues/22)


### 2.0.8

* Bump dependencies - **[@jkrems](https://github.com/jkrems)** [#35](https://github.com/groupon/selenium-download/pull/35)
  - [`70f7fdf`](https://github.com/groupon/selenium-download/commit/70f7fdfcd815278b3c12ef9ff05361593cce8ecc) **chore:** Bump dependencies - see: [#23](https://github.com/groupon/selenium-download/issues/23)


### 2.0.7

* Use https to download binaries - **[@jkrems](https://github.com/jkrems)** [#32](https://github.com/groupon/selenium-download/pull/32)
  - [`1957ca7`](https://github.com/groupon/selenium-download/commit/1957ca79707b9bee224b222500ceb250f736b93b) **fix:** Use https to download binaries


### 2.0.6

* Fail cleanly when the chromedriver download 404s - **[@jkrems](https://github.com/jkrems)** [#31](https://github.com/groupon/selenium-download/pull/31)
  - [`f1a5d73`](https://github.com/groupon/selenium-download/commit/f1a5d73bd0d3b3ceab95f08b4353d8ce856bee68) **fix:** Fail cleanly when the chromedriver download 404s


### 2.0.5

* Fix failing OSX chromedriver download due to 2.23 dropped support for mac 32 bit - **[@brettjonesdev](https://github.com/brettjonesdev)** [#30](https://github.com/groupon/selenium-download/pull/30)
  - [`f84195e`](https://github.com/groupon/selenium-download/commit/f84195ed0cd6986034de582869491db7981859fb) **fix:** chromedriver version 2.23 no longer supports mac 32 bit


### 2.0.4

* Support for node v6 and shiny JavaScript - **[@jkrems](https://github.com/jkrems)** [#27](https://github.com/groupon/selenium-download/pull/27)
  - [`af2e601`](https://github.com/groupon/selenium-download/commit/af2e6012b5ff310e1baf472e29b2be3c75f7e628) **chore:** Port to JavaScript
  - [`861da47`](https://github.com/groupon/selenium-download/commit/861da4702118339bbe76bd7e73aaa8b69fd12370) **refactor:** drop download, runs on node 6 - see: [#19](https://github.com/groupon/selenium-download/issues/19)
  - [`6ffd489`](https://github.com/groupon/selenium-download/commit/6ffd48922466d66a44b40feef7b08a14ab38de3c) **test:** Set higher timeout for slow connections - see: [#24](https://github.com/groupon/selenium-download/issues/24)


### 2.0.3

* [`803311c`](https://github.com/groupon/selenium-download/commit/803311c9e922b18195742f9b32b0dd367b761f8a) **fix:** chromedriver download on Windows unzips an .exe file


### 2.0.2

* Updated selenium and chromedriver - **[@gabehayes](https://github.com/gabehayes)** [#21](https://github.com/groupon/selenium-download/pull/21)
  - [`fc359f2`](https://github.com/groupon/selenium-download/commit/fc359f229c765c86c7f6d7f3fd24eddcf4fc8305) **chore:** Update selenium version to 2.53.0
  - [`003876d`](https://github.com/groupon/selenium-download/commit/003876d79128a07d01f9a58699b15d75b79e2ceb) **chore:** Update chromedriver version to 2.22


### 2.0.1

* fix: More reliable (and correct) download - **[@jkrems](https://github.com/jkrems)** [#17](https://github.com/groupon/selenium-download/pull/17)
  - [`7599b95`](https://github.com/groupon/selenium-download/commit/7599b95b98215567019be022c5b3425f4b9ce03c) **fix:** More reliable (and correct) download
* Apply latest nlm generator - **[@i-tier-bot](https://github.com/i-tier-bot)** [#18](https://github.com/groupon/selenium-download/pull/18)
  - [`1e32749`](https://github.com/groupon/selenium-download/commit/1e327496277fad485c5fd7dc9649b8bd5787a8f2) **chore:** Apply latest nlm generator
  - [`0c616b6`](https://github.com/groupon/selenium-download/commit/0c616b6418fc60477b444b77ae903a36a6ecad31) **test:** Convert to proper mocha test
  - [`f16af5c`](https://github.com/groupon/selenium-download/commit/f16af5c3fa63a5393a55ef3042e76d4009ab7b0e) **chore:** Set author to Groupon
  - [`445ce55`](https://github.com/groupon/selenium-download/commit/445ce5533b24d53cddab19efe521ea832e642d2a) **style:** Use assertive over assert
