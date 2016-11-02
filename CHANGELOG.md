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
