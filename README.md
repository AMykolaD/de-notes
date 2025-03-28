# `de-notes`

DeNotes is a simple decentralized application created on the Internet Computer Protocol. It allows users to create and manage notes using their Internet Identity.

## Running the project locally

### Clone the repository 
```bash
git clone https://github.com/AMykolaD/de-notes.git
cd de-notes
```

### Deploy locally

```bash
dfx start --background
dfx deploy
```

Alternatively, you can deploy the project in playground:

```bash
dfx deploy --playground
```

## Usage

Open the app in your browser and log in with your Internet Identity.

After that, you may:
* Check the list of your notes
* Add new notes
* Edit notes
* Pin notes
* Delete notes

## Used technologies
* Front-end: React
* Back-end: Rust

