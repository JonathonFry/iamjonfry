+++
date = "2016-05-08T09:40:20+01:00"
title = "frywedding.com RSVP using Go"
slug = "frywedding-rsvp-using-go"
+++

A big part of building frywedding.com was to allow the guests to RSVP online, which *should* be a lot more reliable than sending by post. (No apologies Royal Mail)

As i've been experimenting with Golang in my spare time I figured it would be a good candidate to build the RSVP backend. I've heard great things about the [scalability](http://marcio.io/2015/07/handling-1-million-requests-per-minute-with-golang/) of golang, so I was sure it would be able to handle requests from 100 guests. (*sarcasm*)

First step was to define the API.

Simple enough?
`/rsvp`

Next step, filter submissions so only invited guests could RSVP.

This required parsing of the form request into an RSVP struct, and ensuring that the `code` field matched a predefined code, sent to users on their invite.

```
func HandlePostRsvp(w http.ResponseWriter, r *http.Request) {
	parseErr := r.ParseForm()

	if parseErr != nil {
		handleError(w, parseErr.Error())
		return
	}
	rsvp := new(Rsvp)
	decoder := schema.NewDecoder()
	decodeErr := decoder.Decode(rsvp, r.PostForm)

	if rsvp.Code != code {
		rsvpError := RsvpError{Name: "Invalid code"}
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(rsvpError)
		return
	}
```

If the form was parsed correctly and the code validation passed, we now need to store the data somewhere. The logical choice was to use a database so I decided on using a simple MySQL database.

SQL table schema:
```
CREATE TABLE rsvp (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
code INT(5),
number_of_guests INT(10),
is_attending BOOLEAN,
dietary_requirements VARCHAR(500),
notes VARCHAR(1000)
);
```

Accessing a database in Go is straightforward and many SQL drivers are available, I used the [https://github.com/go-sql-driver/mysql](https://github.com/go-sql-driver/mysql).

```
func insertRsvpIntoDatabase(rsvp *Rsvp) error {
	db, err := sql.Open("mysql", "user:pass@/rsvp")

	if err != nil {
		return err
	}

	defer db.Close()

	stmtIns, err := db.Prepare("INSERT INTO rsvp (name,code,number_of_guests,is_attending,dietary_requirements,notes) VALUES(?, ?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmtIns.Close()

	_, err = stmtIns.Exec(rsvp.Name, rsvp.Code, rsvp.NumberOfGuests, rsvp.IsAttending, rsvp.DietaryRequirements, rsvp.Notes)
	if err != nil {
		return err
	}

	return nil
}
```
Assuming everything went well we have now inserted the RSVP into the database.

Lastly we wanted to receive notifications when guests had RSVP'd (it was pretty exciting) so I added email integration which sent an email to my wife and I containing the details of the RSVP.

Luckily for me there was an open source library [gomail](https://github.com/go-gomail/gomail) for sending mail using go.

```
func notifyRsvpByEmail(rsvp *Rsvp) {
	m := gomail.NewMessage()
	m.SetHeader("From", "hello@world.com")
	m.SetHeader("To", "hello@world.com")
	m.SetHeader("Subject", "RSVP")

	var buffer bytes.Buffer
	buffer.WriteString(rsvp.Name)
	buffer.WriteString(" has RSVPd!")
	m.SetBody("text/html", buffer.String())

	d := gomail.NewPlainDialer("smtp.test.com", 123, "hello@world.com", "password")

	if err := d.DialAndSend(m); err != nil {
		log.Printf("Failed to send RSVP email")
	}
}
```
Once i've stripped out some sensitive data from the project i'll publish it to GitHub and update this post.
I'm still learning the language itself and it's best practices, so any suggestions/tips/feedback please let me know.

As with all things it wasn't smooth sailing. Turns out I had typo'd the `code` on the backend so the first few guests were refused RSVP due to an 'invalid code', oops.


The rsvp site is still live here - [http://frywedding.com/rsvp.html](http://frywedding.com/rsvp.html)

J
