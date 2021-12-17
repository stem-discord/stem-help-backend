db.adminCommand({ listDatabases: 1, nameOnly: true })
  .databases.map(o => o.name)
  .find(name => ![`local`, `admin`, `config`].includes(name));
