import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export async function POST(req) {
  try {
    const { email, subject, message, recipients } = await req.json();
    console.log(email, subject, message, recipients);
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .invoice-container {
            width: 100%;
            max-width: 800px;
            margin: 20px auto;
            background: #fff;
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
            border: none;
            transform: translateY(0);
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        .invoice-container:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .logo {
            display: inline-block;
            margin-bottom: 20px;
        }
        .logo img {
            width: 100px;
            height: auto;
            transition: box-shadow 0.3s ease-in-out;
        }
        .logo img:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="logo"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAeCAIAAABoq03CAAANlElEQVRoBe1Ze1QU1xnfXRB8REjV2CTGNCcmJmUXFNGgja2iSeOjNTWmVtskNTGNibGJ0XjaNK02HlPLLCC+UNjlrUJQUR4aEMFAhFVBIMhTRJidfS/7fs3uzNxpdmf37oDKgklT/uiee/bcvTP7fff+7nd/3++b4dD///wgCHB+EC//d0IPC2iKAkqtFZWb7mxShanfaHcRFADgfwWn2UlJrSRquUtT2kizkyKp72FqNgJgFoLxorSRBDWy9QYGGgC6ugGLWZs9c3nqzBWimcvT3M3dSZ25PPWZlaLFG/L++Ol5JOOqTG2hfnC4+x3kxxL9swXyp/IHt6e/kM8tVKwqU38kMVTKHDZiZNCwN4cCdE6XRXBSwXiJK1F1GlzsGwL2AwNNAfBJcjWHjwxoEfGen55vT58nQGYsS+3s1QV0+f3e0NzvnHVKwRGhQ7cxYnRfi8k1wjCEU8VJ8FFtP3QxI19+Q+eEV4fTCQy0i6DW7SgZgDIbdIHQe8kD9/J3T5qtI5vBcGZ5r3sAoMuk9sk5GIRgiM6047IS1H5/UW1yUmsqNND4z4tVMit5r1nddTww0Garc8lb+RxvCCNcPjIhJumhhQd/tGB/yOwENsocPjJpwf6uPv1dPf03BklAZ3VagsT+cA5ORyflYFNyZA9kSnmscY4I5YrRD+r0Ftf9ELbWQcae9Z+bNRUak3NkdgIDrey3znolE0b0+Jh96YUtNQ1Y2de3Dxy/vmhDPrzEiYgfH5OUXdz638D0rjYdJNjbZISBxhGhy86rS1F7tcKRf8u6TWKYekzGvjr3jLLLSNzV1NCDqIV4pkDOmOKK0C2X9d9/MuxGDY/GpUA0p8WlkL4sDgDd0q0NhXHNR8bNSTp4onHoSX+PV41O6t2v/dQZJEb3NpkgBCYntfy8mg30TwvkrfqRJTFmthIV/ohvz4LFaHyzaaSrCBzRkm8UY+ckQYqY82o220efwjTxuWR4deK85KqrUuYGO070yAwZhS17Uut2H6ndK7py8kKXXGOx2FySb+Tltb3ltb0Vkj6p0gwA6MEMzEh5ba+kWW6zD4YDAICpzBev9DG3VTdI9SZcZSNfPOeHckKmVNxhgdNzEGDdRS0b6JXn1TKrO6IJitbhVKXMkdhi3t1o3NNkSmmzXNfiVhfoNrouyOzlmLs1ap046Wb1tHZLeLY3E4zNkObdskIvw+wEABoAOr+sA+LI5ce/svUsNE0BUNOA8fiIm8E9JP7QwoMylQUAWqO3f54meXzpkdDoRJ5AyBUgvEjhhLn7YtflJmTWP/lSalhsclhs8uSfHdiZUusiqA//XcmMhMUmT19y5NCJxkFCUaG1rt1eFD4/Oew5d3tyWVrBha5uIxFx0nuiOSL00WOy4j4bnJ7OQS0sVkKguSL0b9cMOAlcFLiAOeafVT6YjQWJUa7I3ULSpQ/lYtsl+t9c0IZlYUybd0bZ5jkB2yX6sRlSxtSETGm1AodehtkJAPS3unjX4cteoPkITyD8675q3EU6nITV5mq71b904xfuq75UGbsu12DGW25qVn94hifwj0MLXAEyNjoxONKrVUJnJxw8fp2kQNqpb9wb5mk8AbJy82mjxb8Yk9W556gEHiyeAHl5S6FCY6lT4dNP+Fk46pSiXoPjJLATQOugjrabp+b6BUlYljSj02LAycOtpsdY/4I7wRGhY9LR8ZleQDkidGmpCjUTFEX/7qI22Jdap+Zi7foRK6sAQJMkWLn5NMSRJxCu/bhkX+71z9Mkb3xy7unlaVwfOhw+EhQp/OxIrVZvX7O1iOeDksNHGHDHxyS5b/ZtibsTET9uTlL+lx00Tbfd6n9ksT8TPL1CdL1dxQQLAOB8Tc8jiw4z28AVIM/+Slx1BQUAnO2zsaF85gv55w2GhGbjDol+cYkqPNsPGUeELipRqWxkRqclPGvA+Jh06QNZWEj6gEEG/Tcu9RudlBGn4kpVXJ9Un3dGqbCNTNvRdKAS3O5wTV96hB2z3r6PKxi8GJSjXsls7FAjGVe5AoTj0ddcATItLuWtf5QlZden5DW9t/vC4y8c9WPNRyY/f7BC0kfTtM7keHtXGdenykNnJ2aevQEADQCNKc2/fv+0+3x4NnXy8wf3H2sgPTVocovpAVYAsmNzUP+BLGz/DVObzhnFqm7GZUjjSlU7643iTsueRuPiUlWojx/cclCEbpPonRRo1Tn5LIJ6rVKjx0em7QIDLVVZgiI9K4SRyIQw8zMingGUFynkr8q43q7uwYyPLfFsjOe2Kc8fzCludeBeReXAidyStuAoIcQ6YlX6jZtamqYBAGcu3pw4z5dX+cjWvZUkSZkszp2HLo+NTmQ2OChS+Non57QGO03TLgp8VKdni+hB4MKf4dnYp9cMGjv1yTXDGB8DcETo+kotaiGZapECdJ+F+EWJP3LHZkgTmo0A0OdQ28PH/BT0r0bjfVTzAaijul7qD2EPdrxIYVCkMChKGByVEBqdOCEm6bElKX/4S0ldkwwAOqe4NTQ6kcExZHbi5j0VgyqxW1LDNCgWI+Lj3sxT9XszeFeffs5vs5mw5fCRBX84pjM6iqq6pyw8xAzyBMis1ZmSZjmTJ41Oan3lAFHBFaPB3iYdky4dlyF9MBtbUKQ63Gp2EKDbSPysSAXRf/yE7Kp6MNXuuGKASW9SDnbqtju1pndaJvjODU+M5nVboYIcZiYMENEA0KkFzTD6OHxk/Nx9cW/mv7yl8OUthWu3FW1DLh0vaWvqUFts7hlTFPj7gRrI2uGxyY0d6kFT6cEMP3nxKERz9QdnbA5vvOMu8u2dZdDdtLiU7OK2l94pcBORZ48fXnQo62wrVPF9ZuIFlrYLTkcjTyleKdesKdf8tkKzsbofaTJVyByY1fukrUruYPPM+1/rzHdUd7vqDeN87DHtuOyq2q3u9jYZg8VeBp+UjdUo7IMU0aA13vXnUBFNAfBRfBUEhScQvrSpwOkiGeq887koQVLbhf77H5yf3NHTz/ZKAfB1I+blAU/y/NOucu/RpWkKgKyi1iAmi0bEh0YnPvlSashsD2nwkeCohHf+WcZ+kHJNjT/rq9Y4InT6CVmdCgfeD9utt38ec7CL8r9c0TMaGd5qJ8CrFVrIRU99Ib9pJL4VMO9f1nF9hBNxUt4+wud2jP2hgMad5KotPskRER8U6dZ2cFp3dkgK7Ej4yh2SnjY+Jim9sAXiCACt1Fp/93Gxe+c8FD9x3r6EzGtsOx23dd7cy84EHlk5//fHmjs1MJQAoIv7bGFZfuqMPq24ZRqqvP5SaocgckTo4mJll9FfFjkpkNVleeS4XyzOP6uUW4l+B7WizP846cVzKuXIJUcA6tCb8Pnrc2FEh8xOKLzYzcZlUB8A8G0RCOUBV4A8Gpdy/Fx7+23dTdRwoa5v4z/KQmd7GNwD9KNxKV/Ve8tIxpTBjG/ecwFyBXQ9femRgvJOtjuCAqIOS5DvRHNE6Mov1fIhIahT4Q+zZDVXjG6p1V1WOrqNrnoNvv+G6Yk8P8ocEfpWtVvbKWxkTKG/6nm9qt9KjFhyBAAaVZhmrhDB1YY9l4yp/AUue9mwf+maNDx2P+RZDh+Z+Fzys78SR7yc8dDPD7HFNYePPLUsTa4eYJACoLS658EFAyyEzEr8WHjJOrAotxHUznoDzGwcEfphrW7oJ3M6B/lalZbnk8Oe8kQ6/YSMf1LxRJ4MUjO0mdBscpDgptE1I99bfPLE6HaJ3lOTwxUPtzMUddzo1k5ZeBAC/fgLRyAP3Mu82epcv6NkzKwENtaMBa4AmTgvGXIuh49Erc60OfyHl7HZgxnmrfMdIw9fLdqQ13XH+wQdTr1e5ZccY8RoUospIATFffYn8mSw9ICYckRoaIYUSgtGROfdshEAVMrsP/adg9B06YEb5nutfejxoYCuaZBNmLsvOCohOCohZHbiL98pGNqWRw7TCo319b+Whs/fzxN49TJXgIyPSYpanfnpgZonl6V5DArHRieu3VY06NUXBUBDmzJiVbp3dyPiZyxL+/Ly7TsTr8JGLC1V+cQcOiUHO94d+EEPQYG0dvOMfFmIT1pwRG5FODUX21jd/2qFZoxPIE7NwS7JHYCmU9vMk3MwxtGUXKy0zy3h7+MzFNC9ctNW5NKm3RWbdlds/vxi5VV0mA6MFlx8umXN1rOLN+Qt2pC34t2Tuw5f7pUbtQb77qN1jMEP/l1V1ywfZFCutqzfUQJZfmx00j8PX3a67lLvWlzUkTbzpup+pn1Wb+gdMhNCRyRFN2rwP9fqXjyvXlSiWlKqertaVy61W12gqNf2Xo3XYFq72exy1wDX1Pi2Oh3jZW+TSeu4H4IOwNFMhFKAZhqc63A6ANAOnNAa7Bq93WJzUr6XdQAAxhrUD9Aa7iTj06+GzPK+tQmelbB808le2T2f/AK3IvS2O61Bs3ftuChgxCmNndTjFHyROMAg628AemENjrQ7VESP1NZ3uZ+iQHUD9tTyNJgSfroqXfKN4rvYHFX/HRVAA5ruRg1LN+ZD0hg/N0mYeY3wvcoZVZDd32RGBdAkSR3OawqP3R/mbsmTFhxYu71IrfM/wr+/tY2qf40KoAEAt6SGczU9TCuv7b0tM44qmL77ZEYF0N99GaPfwn8A6rKkXtyz8aEAAAAASUVORK5CYII=" width="120" height="30"></div>
        <div class="content" style="
          font-size: 14px;
          line-height: 1.4;
          color: #333;
          font-weight: bold;
          margin-top: 15px;
          background: #fafafa;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.3s ease-in-out;">Dear,<br><br>Unauthorized transactions from your PayPal account pertaining to a charge for #DATE# in the amount of #AMOUNT# USD have come to our attention.</div>
        <p><br></p>
        <div class="contact-info" style="
          font-size: 14px;
          line-height: 1.4;
          color: #333;
          margin-top: 15px;
          background: #fafafa;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.3s ease-in-out;">If you are certain that you have not made this transaction, then please get in touch with us within the next 12 hours via calling on&nbsp;<span style='font-weight: bold; font-size: 18px; font-family: "Arial Black", Gadget, sans-serif; color: rgb(40, 50, 78);'>Helpline Number: +1 (804) 631-3142</span><span style='font-size: 18px; font-family: "Arial Black", Gadget, sans-serif; color: rgb(40, 50, 78);'>.</span><br>Kindly inform us of the circumstances. Upon verification, we will be able to <span style="font-weight: bold;">refund the amount into your account within 6 hours from the time of reporting.</span><br>
            <div style="text-align: center;">
                <h2 style="
              font-size: 22px;
              color: #000000;
              text-transform: uppercase;
              margin-bottom: 15px;">Transaction Details</h2>
            </div>
            <table style="
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border: 1px solid #ccc;
            background-color: #fff;
            border-radius: 6px;
            text-align: center;">
                <thead>
                    <tr style="
                background-color: #009cde;
                color: #fff;
                text-transform: uppercase;">
                        <th style="padding: 10px; border: none;">Product Name</th>
                        <th style="padding: 10px; border: none;">Trade Amount</th>
                        <th style="padding: 10px; border: none;">Quantity</th>
                        <th style="padding: 10px; border: none;">Trade ID</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border-top: 1px solid #ccc;">Bitcoin</td>
                        <td style="padding: 10px; border-top: 1px solid #ccc;">#AMOUNT#</td>
                        <td style="padding: 10px; border-top: 1px solid #ccc;">0.0013</td>
                        <td style="padding: 10px; border-top: 1px solid #ccc;">#RANDOM#</td>
                    </tr>
                </tbody>
            </table>
            <p style="
            font-family: Arial, sans-serif;
            font-size: 16px;
            color: #333;
            margin-top: 20px;
            border-radius: 8px;">However, if <span style="font-weight: bold;">no response is received within this time frame</span>, then we&apos;ll be forced to <span style="font-weight: bold;">charge you for the full amount</span>, and it will be reflected on your <span style="font-weight: bold;">account statement soon</span>.</p>
            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">If you didn&apos;t make this purchase, kindly <span style="font-weight: bold;">contact our support team</span> to cancel it or to raise a refund at <span style='font-weight: bold; font-size: 18px; font-family: "Arial Black", Gadget, sans-serif; color: rgb(40, 50, 78);'>+1 (804) 631-3142</span><span style='font-size: 18px; font-family: "Arial Black", Gadget, sans-serif; color: rgb(40, 50, 78);'>.</span><span style="font-size: 18px;"><br></span><br>We understand that saving money is important to you and we appreciate your time in keeping our account <span style="font-weight: bold;">secure and safe for both sides</span>.</p>
            <p style="
            font-family: Arial, sans-serif;
            font-size: 16px;
            color: #333;
            margin-top: 20px;">Thank you for choosing our service.</p>
            <p style="
            font-family: Arial, sans-serif;
            font-size: 16px;
            color: #333;
            margin-top: 20px;">Team <span style="color: #00457C; font-weight: bold;">Pay</span><span style="color: #0079C1; font-weight: bold;">Pal</span></p>
        </div>
    </div>
</body>
</html>`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: email,
      bcc: recipients,
      subject: subject,
      text: message,
      html: htmlContent,
      // .replace(/#DATE#/g, new Date().toLocaleDateString())
      // .replace(/#AMOUNT#/g, amount)
      // .replace(/#RANDOM#/g, random),
      replyTo: email,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
