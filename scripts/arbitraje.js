# ... (cabecera igual)
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm install axios
      - name: Debug de API
        run: node scripts/debug-api.js # Ejecutamos el espía
      - name: Guardar JSON para análisis
        run: |
          git config --global user.name 'Debug Bot'
          git config --global user.email 'debug@sportlive.com'
          git add data/debug-api-raw.json
          git commit -m "Capture de JSON real para análisis" || exit 0
          git push