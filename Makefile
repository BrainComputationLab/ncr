test: lint
	py.test --spec --cov-report term-missing --cov ncr ncr/tests/**/*.py ncr/tests/*.py
lint:
	flake8 ncr/
bootstrap:
	./.bootstrap.sh
