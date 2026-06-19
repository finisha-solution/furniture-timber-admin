#!/bin/bash
firebase deploy --only functions,firestore,storage
echo "Deployment complete!"
